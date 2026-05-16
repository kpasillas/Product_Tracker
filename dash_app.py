#!/usr/bin/env python3

import dash
from dash import dcc, html, dash_table, Input, Output
import plotly.express as px
import pandas as pd
from sqlalchemy import text
from zoneinfo import ZoneInfo
from db.connection import get_mysql_engine

# -------------------------
# APP INIT
# -------------------------

app = dash.Dash(__name__, title="Deal Tracker")
server = app.server  # expose for gunicorn / deployment

engine = get_mysql_engine()


# -------------------------
# DATA FUNCTIONS
# -------------------------


def fetch_current_data():
    """
    Load the most recent report, current prices, and 3-month averages.
    Returns (current_df, report_date).
    """

    report_query = text("""
        SELECT id AS report_id, timestamp AS report_date
        FROM report
        ORDER BY timestamp DESC
        LIMIT 1
    """)

    with engine.begin() as conn:
        row = conn.execute(report_query).fetchone()

    report_id = row.report_id
    report_date = row.report_date.replace(tzinfo=ZoneInfo("UTC")).astimezone(
        ZoneInfo("America/Los_Angeles")
    )

    current_query = f"""
        SELECT
            product.id  AS product_id,
            name,
            price       AS price_num,
            store
        FROM price
        JOIN product ON price.product_id = product.id
        WHERE report_id = "{report_id}"
          AND price >= 0
    """
    current_df = pd.read_sql(current_query, engine)

    avg_query = """
        SELECT product_id, ROUND(AVG(price), 2) AS avg_price_num
        FROM price
        WHERE report_id IN (
            SELECT id FROM report WHERE timestamp >= NOW() - INTERVAL 3 MONTH
        )
        GROUP BY product_id
    """
    avg_df = pd.read_sql(avg_query, engine).set_index("product_id")
    current_df = current_df.join(avg_df, on="product_id")

    # Derived metrics
    current_df["pct_change"] = (
        current_df["price_num"] - current_df["avg_price_num"]
    ) / current_df["avg_price_num"]
    current_df["price_fmt"] = current_df["price_num"].map("${:,.2f}".format)
    current_df["pct_fmt"] = current_df["pct_change"].map("{:+.1%}".format)

    # Store-aware buy link
    def buy_link(row):
        if row["store"] == "Amazon":
            url = f"https://www.amazon.com/dp/{row['product_id']}"
            return f"[Buy]({url})"
        else:
            url = f"https://www.cheapcharts.com/us/itunes/movies/{row['product_id']}"
            return f"[View]({url})"

    current_df["buy_link"] = current_df.apply(buy_link, axis=1)

    return current_df, report_date


def fetch_history(product_name, product_id_list):
    """
    Load price history for one product or an aggregate of all products.
    """

    if product_name and product_name != "All":
        query = f"""
            SELECT DATE(timestamp) AS date, name, AVG(price) AS price
            FROM price
            JOIN product ON price.product_id = product.id
            JOIN report  ON price.report_id  = report.id
            WHERE product.name = "{product_name}"
              AND price >= 0
            GROUP BY DATE(timestamp), name
        """
    else:
        ids = tuple(product_id_list)
        if not ids:
            return pd.DataFrame(columns=["date", "price"])
        ids_sql = f"('{ids[0]}')" if len(ids) == 1 else str(ids)
        query = f"""
            SELECT DATE(timestamp) AS date, AVG(price) AS price
            FROM price
            JOIN product ON price.product_id = product.id
            JOIN report  ON price.report_id  = report.id
            WHERE product.id IN {ids_sql}
              AND price >= 0
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp)
        """

    df = pd.read_sql(query, engine)
    df["date"] = pd.to_datetime(df["date"])

    # Ensure "all products" path returns a single averaged series (one row per date)
    if not (product_name and product_name != "All"):
        df = df.groupby("date", as_index=False)["price"].mean()

    return df


# -------------------------
# HELPERS
# -------------------------


def kpi_card(label, value, color="#111827"):
    return html.Div(
        [
            html.P(
                label,
                className="kpi-label",
                style={
                    "fontSize": "11px",
                    "color": "#9ca3af",
                    "margin": "0 0 8px",
                    "textTransform": "uppercase",
                    "letterSpacing": "0.07em",
                    "fontWeight": "500",
                },
            ),
            html.P(
                value,
                className="kpi-value",
                style={
                    "fontSize": "28px",
                    "fontWeight": "500",
                    "color": color,
                    "margin": 0,
                    "lineHeight": 1,
                },
            ),
        ],
        style={
            "background": "white",
            "borderRadius": "10px",
            "padding": "18px 20px",
            "border": "1px solid #e5e7eb",
        },
    )


# -------------------------
# TABLE CONFIG
# -------------------------

TABLE_COLUMNS = [
    {"name": "Product",      "id": "name",       "type": "text"},
    {"name": "Price",        "id": "price_fmt",  "type": "text"},
    {"name": "vs 3-mo avg",  "id": "pct_fmt",    "type": "text"},
    {"name": "Store",        "id": "store",      "type": "text"},
    {"name": "",             "id": "buy_link",   "type": "text", "presentation": "markdown"},
    {"name": "",             "id": "pct_change", "type": "numeric"},  # hidden; drives row coloring
]

TABLE_STYLE_CONDITIONAL = [
    # Alternating rows
    {"if": {"row_index": "odd"}, "backgroundColor": "#f9fafb"},
    # pct_fmt color-coding using the hidden pct_change column
    {
        "if": {"filter_query": "{pct_change} < -0.15", "column_id": "pct_fmt"},
        "color": "#1d9e75",
        "fontWeight": "500",
    },
    {
        "if": {"filter_query": "{pct_change} >= -0.15 and {pct_change} < 0", "column_id": "pct_fmt"},
        "color": "#2563eb",
    },
    {
        "if": {"filter_query": "{pct_change} >= 0", "column_id": "pct_fmt"},
        "color": "#9ca3af",
    },
]


# -------------------------
# LAYOUT
# -------------------------

app.layout = html.Div(
    [
        dcc.Interval(id="refresh-interval", interval=10 * 60 * 1000, n_intervals=0),
        dcc.Store(id="data-store"),

        # --- Dark header ---
        html.Div(
            html.Div(
                [
                    html.Div(
                        [
                            html.Span("🛒", style={"fontSize": "36px", "marginRight": "12px"}),
                            html.Span(
                                "Deal Tracker",
                                style={"color": "#e8edf4", "fontSize": "36px", "fontWeight": "700"},
                            ),
                        ],
                        style={"display": "flex", "alignItems": "center", "marginBottom": "6px"},
                    ),
                    html.Span(
                        id="last-updated",
                        style={"fontSize": "12px", "color": "#6b7a99", "paddingLeft": "4px"},
                    ),
                ],
                style={
                    "display": "flex",
                    "flexDirection": "column",
                    "justifyContent": "center",
                    "maxWidth": "1100px",
                    "width": "100%",
                    "margin": "0 auto",
                    "padding": "0 28px",
                },
            ),
            style={
                "background": "#1a1f2e",
                "height": "96px",
                "display": "flex",
                "alignItems": "center",
                "position": "fixed",
                "top": "0",
                "left": "0",
                "right": "0",
                "zIndex": "1000",
            },
        ),

        # --- Main content ---
        html.Div(
            [
                # KPI row
                html.Div(
                    [
                        html.Div(id="kpi-best-deal"),
                        html.Div(id="kpi-avg-discount"),
                        html.Div(id="kpi-item-count"),
                    ],
                    className="kpi-grid",
                ),

                html.Hr(style={"border": "none", "borderTop": "1px solid #e5e7eb", "margin": "0 0 24px"}),

                # Section title
                html.P(
                    "Best deals right now",
                    style={"fontSize": "15px", "fontWeight": "500", "color": "#111827", "margin": "0 0 14px"},
                ),

                # Controls row
                html.Div(
                    [
                        html.Div(
                            [
                                html.Span(
                                    "Sort by",
                                    style={"fontSize": "13px", "color": "#9ca3af", "marginRight": "10px"},
                                ),
                                dcc.RadioItems(
                                    id="sort-radio",
                                    options=[
                                        {"label": "Discount", "value": "pct_change"},
                                        {"label": "Price",    "value": "price_num"},
                                    ],
                                    value="pct_change",
                                ),
                            ],
                            style={"display": "flex", "alignItems": "center"},
                        ),
                        dcc.Dropdown(
                            id="store-filter",
                            placeholder="All stores",
                            multi=True,
                            className="store-filter-dropdown",
                            style={"fontSize": "13px"},
                        ),
                    ],
                    className="controls-row",
                ),

                # Deals table — outer div clips border-radius, inner div scrolls
                html.Div(
                  html.Div(
                    dash_table.DataTable(
                    id="deals-table",
                    columns=TABLE_COLUMNS,
                    hidden_columns=["pct_change"],
                    export_format="none",
                    style_table={"minWidth": "520px"},
                    style_header={
                        "backgroundColor": "white",
                        "fontWeight": "500",
                        "color": "#9ca3af",
                        "fontSize": "11px",
                        "textTransform": "uppercase",
                        "letterSpacing": "0.06em",
                        "border": "none",
                        "borderBottom": "1px solid #e5e7eb",
                        "padding": "11px 14px",
                    },
                    style_cell={
                        "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        "fontSize": "14px",
                        "padding": "12px 14px",
                        "textAlign": "left",
                        "border": "none",
                        "borderBottom": "1px solid #f3f4f6",
                        "color": "#111827",
                        "backgroundColor": "white",
                        "whiteSpace": "normal",
                    },
                    style_cell_conditional=[
                        {"if": {"column_id": "price_fmt"}, "textAlign": "right", "fontVariantNumeric": "tabular-nums"},
                        {"if": {"column_id": "pct_fmt"},   "textAlign": "right", "fontVariantNumeric": "tabular-nums"},
                        {"if": {"column_id": "buy_link"},  "textAlign": "center", "width": "80px"},
                        {"if": {"column_id": "store"},     "color": "#6b7280", "fontSize": "13px"},
                    ],
                    style_data={"backgroundColor": "white"},
                    style_data_conditional=TABLE_STYLE_CONDITIONAL,
                    page_size=25,
                    markdown_options={"link_target": "_blank"},
                    ),
                    style={"overflowX": "auto"},
                  ),
                  style={"border": "1px solid #e5e7eb", "borderRadius": "10px", "overflow": "hidden"},
                ),

                html.Hr(style={"border": "none", "borderTop": "1px solid #e5e7eb", "margin": "36px 0 24px"}),

                # History section
                html.P(
                    "Price history",
                    style={"fontSize": "15px", "fontWeight": "500", "color": "#111827", "margin": "0 0 12px"},
                ),

                dcc.Dropdown(
                    id="product-dropdown",
                    value="All",
                    clearable=False,
                    style={"fontSize": "14px", "maxWidth": "480px", "marginBottom": "16px"},
                ),

                html.Div(
                    dcc.Graph(id="history-chart", config={"displayModeBar": False}),
                    style={
                        "background": "white",
                        "border": "1px solid #e5e7eb",
                        "borderRadius": "10px",
                        "overflow": "hidden",
                    },
                ),
            ],
            style={
                "maxWidth": "1100px",
                "margin": "0 auto",
                "padding": "116px 28px 60px",
            },
        ),
    ]
)


# -------------------------
# CALLBACKS
# -------------------------


@app.callback(
    Output("data-store",       "data"),
    Output("last-updated",     "children"),
    Output("kpi-best-deal",    "children"),
    Output("kpi-avg-discount", "children"),
    Output("kpi-item-count",   "children"),
    Output("store-filter",     "options"),
    Output("product-dropdown", "options"),
    Input("refresh-interval",  "n_intervals"),
)
def refresh_data(_n):
    """Re-query the DB on load and every 10 minutes."""

    df, report_date = fetch_current_data()

    from datetime import datetime
    today_pacific = datetime.now(ZoneInfo("America/Los_Angeles")).date()
    date_part = "Today" if report_date.date() == today_pacific else report_date.strftime("%b %-d")
    last_updated = f"↻  Updated {date_part} @ {report_date.strftime('%H:%M %Z')}"

    best_deal    = df["pct_change"].min()
    avg_discount = df["pct_change"].mean()
    item_count   = len(df)

    store_options = [{"label": s, "value": s} for s in sorted(df["store"].unique())]
    product_options = (
        [{"label": "All products", "value": "All"}]
        + [{"label": n, "value": n} for n in sorted(df["name"].unique())]
    )

    return (
        df.to_json(date_format="iso", orient="split"),
        last_updated,
        kpi_card("Best deal",      f"{best_deal:.1%}",    "#1d9e75"),
        kpi_card("Avg vs 3-mo",    f"{avg_discount:.1%}", "#185fa5"),
        kpi_card("Items tracked",  str(item_count),       "#111827"),
        store_options,
        product_options,
    )


@app.callback(
    Output("deals-table", "data"),
    Input("data-store",   "data"),
    Input("sort-radio",   "value"),
    Input("store-filter", "value"),
)
def update_table(json_data, sort_col, stores):
    """Re-sort and re-filter the deals table."""

    if not json_data:
        return []

    df = pd.read_json(json_data, orient="split")

    if stores:
        df = df[df["store"].isin(stores)]

    # Ascending: cheapest price first, or most-discounted (most-negative) first
    df = df.sort_values(sort_col, ascending=True)

    cols = ["name", "price_fmt", "pct_fmt", "store", "buy_link", "pct_change"]
    return df[cols].to_dict("records")


@app.callback(
    Output("history-chart",   "figure"),
    Input("product-dropdown", "value"),
    Input("data-store",       "data"),
)
def update_chart(product, json_data):
    """Reload price history when the product selection changes."""

    if not json_data:
        return {}

    # Treat blank/None dropdown as "All"
    if not product:
        product = "All"

    df = pd.read_json(json_data, orient="split")
    pid_list = df["product_id"].tolist()

    history_df = fetch_history(product_name=product, product_id_list=pid_list)

    if history_df.empty:
        return px.line(title="No history available")

    fig = px.line(history_df, x="date", y="price", markers=True)

    fig.update_layout(
        title=None,
        xaxis_title=None,
        yaxis_title=None,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font={
            "family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            "size": 12,
            "color": "#9ca3af",
        },
        margin={"t": 20, "b": 40, "l": 55, "r": 20},
        legend={"title": "", "bgcolor": "rgba(0,0,0,0)", "font": {"color": "#6b7280"}},
        hoverlabel={
            "bgcolor": "#1a1f2e",
            "font_color": "#e8edf4",
            "bordercolor": "#1a1f2e",
        },
    )
    fig.update_traces(line_color="#378add", line_width=2, marker_color="#378add", marker_size=5)
    fig.update_xaxes(showgrid=False, showline=True, linecolor="#e5e7eb", tickcolor="#e5e7eb")
    fig.update_yaxes(
        showgrid=True,
        gridcolor="#f3f4f6",
        tickprefix="$",
        zeroline=False,
        tickcolor="#e5e7eb",
    )

    return fig


# -------------------------
# ENTRY POINT
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)
