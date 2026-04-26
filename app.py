import streamlit as st
import altair as alt
import pandas as pd
from db.connection import get_mysql_engine
from datetime import datetime
from zoneinfo import ZoneInfo

# -------------------------
# PAGE CONFIG
# -------------------------
st.set_page_config(layout="wide", page_title="Deal Tracker", page_icon="🛒")

st.title("🛒 Product Tracker")

engine = get_mysql_engine()

# -------------------------
# BUILD HTML
# -------------------------


def render_table(df):
    html = """
    <style>
    .deal-table {
        width: 100%;
        border-collapse: collapse;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .deal-table th {
        text-align: left;
        padding: 10px;
        border-bottom: 2px solid #ddd;
        font-size: 14px;
        color: #666;
    }

    .deal-table td {
        padding: 12px 10px;
        border-bottom: 1px solid #eee;
        font-size: 15px;
    }

    .deal-row:hover {
        background-color: #f9fafb;
    }

    .price {
        font-weight: 600;
        white-space: nowrap;
    }

    .vs_avg {
        white-space: nowrap;
    }

    .good { color: #16a34a; }
    .bad { color: #dc2626; }
    .neutral { color: #6b7280; }

    .buy-btn {
        background-color: #71b3e5;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }

    .buy-btn:hover {
        background-color: #3d9be2;
    }

    /* Mobile */
    @media (max-width: 768px) {
        .deal-table th, .deal-table td {
            font-size: 12px;
            padding: 8px;
        }
    }
    </style>

    <table class="deal-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Vs Avg</th>
                <th>Store</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
    """

    for _, row in df.iterrows():

        # Color logic
        if row["pct_change"] < -0.15:
            cls = "good"
            signal = "🔥"
        elif row["pct_change"] < 0:
            cls = "good"
            signal = "👍"
        else:
            cls = "neutral"
            signal = "—"

        url = f"https://amazon.com/dp/{row['product_id']}"

        html += f"""
        <tr class="deal-row">
            <td>{row['Name']}</td>
            <td class="price">{row['Price']}</td>
            <td class="{cls} vs_avg">{row['% vs Avg']} {signal}</td>
            <td>{row['Store']}</td>
            <td>
                <a class="buy-btn" href="{url}" target="_blank">
                    🛒 Buy Now
                </a>
            </td>
        </tr>
        """

    return html


report_query = """
    SELECT *
    FROM product_tracker.report
    ORDER BY timestamp DESC
    LIMIT 1
"""

report_df = pd.read_sql(report_query, engine)

report_id = str(report_df["id"].max())
report_date = (
    datetime.strptime(str(report_df["timestamp"].max()), "%Y-%m-%d %H:%M:%S")
    .replace(tzinfo=ZoneInfo("UTC"))
    .astimezone(ZoneInfo("America/Los_Angeles"))
)

st.caption(f"📅 Last updated: {report_date.strftime('%b %d, %Y %I:%M %p')}")

# -------------------------
# CURRENT PRICES
# -------------------------
current_query = f"""
    SELECT report_id, product.id AS product_id, name AS Name, price AS price_num, store AS Store
    FROM price JOIN product ON price.product_id = product.id
    WHERE
            report_id = "{report_id}"
        AND price >= 0
"""

current_df = pd.read_sql(current_query, engine)

product_id_list = tuple(current_df["product_id"].tolist())

# -------------------------
# AVERAGE PRICES (3 months)
# -------------------------
avg_query = """
    SELECT product_id AS product_id, ROUND(AVG(price), 2) AS avg_price_num
    FROM price
    WHERE report_id IN (
        SELECT id
        FROM report
        WHERE
            timestamp >= NOW() - INTERVAL 3 MONTH
    )
    GROUP BY product_id
"""

avg_df = pd.read_sql(avg_query, engine).set_index("product_id")

current_df = current_df.join(avg_df, on="product_id")

# -------------------------
# METRICS
# -------------------------
current_df["pct_change"] = (
    current_df["price_num"] - current_df["avg_price_num"]
) / current_df["avg_price_num"]

current_df["Price"] = current_df["price_num"].map("${:,.2f}".format)
current_df["% vs Avg"] = current_df["pct_change"].map("{:.1%}".format)


# Color flag
def flag(row):
    if row["pct_change"] < -0.15:
        return "🔥 Deal"
    elif row["pct_change"] < 0:
        return "👍 Good"
    else:
        return "⚠️ Normal"


current_df["Signal"] = current_df.apply(flag, axis=1)

# -------------------------
# KPI CARDS
# -------------------------
col1, col2, col3 = st.columns(3)

best_deal = current_df["pct_change"].min()
avg_discount = current_df["pct_change"].mean()
item_count = len(current_df)

col1.metric("🔥 Best Deal", f"{best_deal:.1%}")
col2.metric("📉 Avg Discount", f"{avg_discount:.1%}")
col3.metric("📦 Items Tracked", item_count)

st.divider()

# -------------------------
# TOP DEALS TABLE
# -------------------------
st.subheader("🔥 Best Deals Right Now")

view_type = st.radio(
    label="**Sort by**", options=["Price", "Discount"], horizontal=True
)

html_table = render_table(
    current_df.sort_values(
        "price_num" if view_type == "Price" else "pct_change", ascending=True
    )
)

st.html(html_table)

# -------------------------
# PRODUCT SELECTOR
# -------------------------
product_list = ["All"] + sorted(current_df["Name"].unique().tolist())
product = st.selectbox("🔎 Select product", product_list)

# -------------------------
# HISTORY QUERIES
# -------------------------
single_item_history_query = f"""
    SELECT DATE(timestamp) AS Date, name AS Name, AVG(price) AS Price
    FROM price
    JOIN product ON price.product_id = product.id
    JOIN report ON price.report_id = report.id
    WHERE
            product.name = "{product}"
        AND price >= 0
    GROUP BY DATE(timestamp), name
"""

all_item_history_query = f"""
    SELECT DATE(timestamp) AS Date, AVG(price) AS Price
    FROM price
    JOIN product ON price.product_id = product.id
    JOIN report ON price.report_id = report.id
    WHERE
            product.id IN {product_id_list}
        AND price >= 0
    GROUP BY DATE(timestamp)
"""

history_df = pd.read_sql(
    all_item_history_query if product == "All" else single_item_history_query, engine
)

history_df["Date"] = pd.to_datetime(history_df["Date"])

# -------------------------
# CHART (ALTair upgrade)
# -------------------------
st.subheader("📉 Price History")

chart = (
    alt.Chart(history_df)
    .mark_line(point=True)
    .encode(x="Date:T", y="Price:Q", tooltip=["Date", "Price"])
    .interactive()
)

st.altair_chart(chart, use_container_width=True)
