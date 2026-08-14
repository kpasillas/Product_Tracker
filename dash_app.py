#!/usr/bin/env python3
"""Deal Tracker — mobile-first price tracking screen.

Layout follows design_handoff_deal_tracker/README.md (Peppy Design System).
"""

import time
from datetime import date
from zoneinfo import ZoneInfo

import dash
import pandas as pd
from dash import Input, Output, dcc, html
from sqlalchemy import text

from db.connection import get_mysql_engine

# -------------------------
# CONFIG
# -------------------------

# What counts as a deal — "Well below avg" badge threshold.
DEAL_THRESHOLD = 0.10
CACHE_TTL_SECONDS = 600
PACIFIC = ZoneInfo("America/Los_Angeles")

INK = "#0b0b0d"
ON_INK = "#ffffff"
MUTE_SOFT = "#acacac"
HAIRLINE = "#dcdcdc"
SUCCESS = "#12c94a"
INFO = "#1668f0"

# compress: the list is ~500KB of card markup; gzip takes it to ~10% of that.
app = dash.Dash(__name__, title="Deal Tracker", update_title=None, compress=True)
server = app.server  # expose for gunicorn / deployment

engine = get_mysql_engine()


# -------------------------
# DATA
# -------------------------

# The tracked set is the `product` table, and each product's current price is its
# own most recent one — never "whatever is in the newest report". The tracker
# inserts the report row before it starts scraping, so keying off the newest
# report empties the screen for the length of a run.
HISTORY_QUERY = """
    SELECT product_id, name, store, date, price
    FROM (
        SELECT
            price.product_id,
            product.name,
            product.store,
            DATE(report.timestamp) AS date,
            price.price,
            ROW_NUMBER() OVER (
                PARTITION BY price.product_id, DATE(report.timestamp)
                ORDER BY report.timestamp DESC
            ) AS rn
        FROM price
        JOIN report  ON price.report_id  = report.id
        JOIN product ON price.product_id = product.id
        WHERE report.timestamp >= NOW() - INTERVAL 3 MONTH
    ) daily
    WHERE rn = 1
    ORDER BY product_id, date
"""

# Newest report that actually carries prices — mid-run that is the run in progress.
LATEST_PRICE_QUERY = text("""
    SELECT MAX(report.timestamp)
    FROM report
    JOIN price ON price.report_id = report.id
""")


def money(v):
    return f"${v:,.2f}"


def pct(v):
    return f"{v:+.1%}"


def chart(vals, w, h, pad, avg=None):
    """Port of the prototype's chart(): scale a series into SVG coordinates."""

    if len(vals) < 2:
        vals = vals * 2
    lo, hi = min(vals), max(vals)
    span = (hi - lo) or 1
    n, top, bot = len(vals), pad, h - pad

    def x(i):
        return round(i * (w / (n - 1)), 1)

    def y(v):
        return round(bot - ((v - lo) / span) * (bot - top), 1)

    return {
        "points": " ".join(f"{x(i)},{y(v)}" for i, v in enumerate(vals)),
        "low_x": x(vals.index(lo)), "low_y": y(lo),
        "high_x": x(vals.index(hi)), "high_y": y(hi),
        "last_x": x(n - 1), "last_y": y(vals[-1]),
        "avg_y": y(lo) if avg is None else y(max(lo, min(hi, avg))),
    }


def badge_for(price, vs, low, high):
    """Deal ladder — first match wins. Returns (label, tone, soft)."""

    # A price that never moved ties its own low; that is not a deal.
    if price <= low < high:
        return "Lowest in 3 mo", "success", False
    if vs <= -DEAL_THRESHOLD:
        return "Well below avg", "info", True
    if vs < -0.01:
        return "Below avg", "neutral", True
    if vs <= 0.01:
        return "At average", "neutral", True
    return "Above avg", "neutral", True


def days_since_change(prices, dates):
    """Days since the last price change in the window, or None if flat throughout."""

    for i in range(len(prices) - 1, 0, -1):
        if prices[i] != prices[i - 1]:
            return (date.today() - dates[i]).days
    return None


def relative_days(days):
    if days is None:
        return "3 mo+"
    if days == 0:
        return "Today"
    if days == 1:
        return "1 day ago"
    return f"{days} days ago"


def available_series(prices, dates):
    """Drop the days a store quoted no price (negative).

    Returns None when the most recent day is one of them — the item is
    unavailable right now, so it leaves the list. An item that simply has not
    been scraped yet in a running report keeps its last known price instead.
    """

    if not prices or prices[-1] < 0:
        return None
    kept = [(p, d) for p, d in zip(prices, dates) if p >= 0]
    return [p for p, _ in kept], [d for _, d in kept]


def product_url(store, product_id):
    if store == "Amazon":
        return f"https://www.amazon.com/dp/{product_id}"
    return f"https://www.cheapcharts.com/us/itunes/movies/{product_id}"


def build_rows():
    """One query per refresh; everything else is derived here."""

    df = pd.read_sql(HISTORY_QUERY, engine)
    df["price"] = df["price"].astype(float)

    with engine.begin() as conn:
        report_date = conn.execute(LATEST_PRICE_QUERY).scalar()
    updated = report_date.replace(tzinfo=ZoneInfo("UTC")).astimezone(PACIFIC)

    rows = []
    for (product_id, name, store), g in df.groupby(
        ["product_id", "name", "store"], sort=False
    ):
        series = available_series(g["price"].tolist(), g["date"].tolist())
        if series is None:
            continue

        prices, dates = series
        price = prices[-1]
        avg = sum(prices) / len(prices)
        vs = (price - avg) / avg if avg else 0.0
        low, high = min(prices), max(prices)
        label, tone, soft = badge_for(price, vs, low, high)
        big = chart(prices, 326, 110, 8, avg)
        spark = chart(prices, 88, 26, 4)

        rows.append({
            "id": product_id, "name": name, "store": store,
            "price": price, "vs": vs, "avg": avg, "low": low, "high": high,
            "low_date": dates[prices.index(low)],
            "high_date": dates[prices.index(high)],
            "badge": label, "tone": tone, "soft": soft,
            "changed": relative_days(days_since_change(prices, dates)),
            "url": product_url(store, product_id),
            "cta": f"Buy on {store}" if store == "Amazon" else f"View on {store}",
            "big": big, "spark": spark,
        })

    rows.sort(key=lambda r: r["vs"])
    return rows, updated


_cache = {"at": 0.0, "value": None}


def load():
    # ponytail: process-local TTL cache. Move to flask-caching if this ever runs
    # on more than the single gunicorn worker it runs on today.
    if _cache["value"] is None or time.time() - _cache["at"] > CACHE_TTL_SECONDS:
        _cache["value"] = build_rows()
        _cache["at"] = time.time()
    return _cache["value"]


# -------------------------
# RENDERING
# -------------------------


def svg_img(markup, w, h, alt, class_name=None):
    """Inline SVG as a data URI — Dash has no SVG components.

    Encodes only what a data URI in an attribute cannot carry raw; full
    percent-encoding would triple the size of the coordinate lists.
    """

    encoded = (
        markup.replace("%", "%25")
        .replace("#", "%23")
        .replace("<", "%3C")
        .replace(">", "%3E")
        .replace('"', "'")
        .replace("&", "%26")
    )
    return html.Img(
        src="data:image/svg+xml," + encoded,
        width=w, height=h, alt=alt, className=class_name,
    )


# Drawn on the ink band, so the stroke is baked white — a data-URI <img> can't
# inherit currentColor the way the prototype's inline SVG does.
CART_SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="30" height="30"'
    f' fill="none" stroke="{ON_INK}" stroke-width="4" stroke-linecap="round">'
    '<line x1="14" y1="20" x2="5" y2="13"/>'
    '<rect x="13" y="19" width="40" height="22" rx="3"/>'
    '<line x1="27" y1="24" x2="27" y2="36" stroke-width="2.5"/>'
    '<line x1="40" y1="24" x2="40" y2="36" stroke-width="2.5"/>'
    '<circle cx="23" cy="52" r="5" stroke-width="3.5"/>'
    '<circle cx="45" cy="52" r="5" stroke-width="3.5"/>'
    "</svg>"
)


def spark_svg(c):
    # Padded viewBox stands in for the prototype's overflow:visible (an <img> clips).
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 94 32" width="94" height="32">'
        f'<polyline points="{c["points"]}" fill="none" stroke="{INK}" stroke-width="1.5"/>'
        f'<circle cx="{c["last_x"]}" cy="{c["last_y"]}" r="2.5" fill="{INK}"/>'
        "</svg>"
    )


def history_svg(c):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 336 120" width="336" height="120">'
        f'<line x1="0" y1="{c["avg_y"]}" x2="326" y2="{c["avg_y"]}"'
        f' stroke="{HAIRLINE}" stroke-width="1" stroke-dasharray="3 3"/>'
        f'<polyline points="{c["points"]}" fill="none" stroke="{INK}" stroke-width="1.5"/>'
        f'<circle cx="{c["high_x"]}" cy="{c["high_y"]}" r="3.5" fill="{MUTE_SOFT}"/>'
        f'<circle cx="{c["low_x"]}" cy="{c["low_y"]}" r="3.5" fill="{SUCCESS}"/>'
        f'<circle cx="{c["last_x"]}" cy="{c["last_y"]}" r="4" fill="{INK}"/>'
        "</svg>"
    )


def stat(label, value):
    return html.Div(
        [html.Span(label, className="stat-label"), html.Span(value, className="stat-value")],
        className="stat",
    )


def legend_item(color, label):
    return html.Span(
        [html.Span(className="dot", style={"background": color}), label],
        className="legend-item",
    )


def card(row, is_open):
    fmt_date = "%-d %b"
    return html.Details(
        [
            html.Summary(
                [
                    html.Div(
                        [
                            html.Span(row["name"], className="name"),
                            html.Div(
                                [
                                    html.Span(row["store"], className="store"),
                                    html.Span(
                                        row["badge"],
                                        className=f"badge badge-{row['tone']}"
                                        + (" badge-soft" if row["soft"] else ""),
                                    ),
                                ],
                                className="meta",
                            ),
                        ],
                        className="card-left",
                    ),
                    html.Div(
                        [
                            html.Span(money(row["price"]), className="price"),
                            svg_img(spark_svg(row["spark"]), 94, 32, "", "spark"),
                        ],
                        className="card-right",
                    ),
                ],
                className="card-top",
            ),
            html.Div(
                [
                    svg_img(
                        history_svg(row["big"]), 336, 120,
                        f"3-month price history for {row['name']}", "history",
                    ),
                    html.Div(
                        [
                            legend_item(
                                SUCCESS,
                                f"Low {money(row['low'])} · {row['low_date'].strftime(fmt_date)}",
                            ),
                            legend_item(
                                MUTE_SOFT,
                                f"High {money(row['high'])} · {row['high_date'].strftime(fmt_date)}",
                            ),
                        ],
                        className="legend",
                    ),
                    html.Div(
                        [
                            stat("3-mo avg", money(row["avg"])),
                            stat("vs avg", pct(row["vs"])),
                            stat("Changed", row["changed"]),
                        ],
                        className="stats",
                    ),
                    html.A(
                        row["cta"], href=row["url"], target="_blank",
                        rel="noopener noreferrer", className="cta",
                    ),
                ],
                className="detail",
            ),
        ],
        className="card",
        open=is_open,
    )


def headline(rows):
    if not rows:
        return "No tracked prices yet."

    # Counts what the sentence says: below average, not just the two strongest badges.
    deals = sum(1 for r in rows if r["vs"] < -0.01)
    best = rows[0]
    short = best["name"].split(":")[0].strip()
    if len(short) > 42:
        short = short[:42].rstrip() + "…"
    if best["badge"] == "Lowest in 3 mo":
        tail = f"{short} is at its lowest price in 3 months."
    else:
        tail = f"{short} is {abs(best['vs']):.1%} below its average."
    return f"{deals} of {len(rows)} items are below their 3-month average. {tail}"


def serve_layout():
    rows, updated = load()
    stores = ["All stores"] + sorted({r["store"] for r in rows})

    return html.Div(
        [
            html.Header(
                [
                    html.Span(
                        [
                            svg_img(CART_SVG, 30, 30, ""),
                            html.Span("Deal Tracker", className="wordmark-text"),
                        ],
                        className="wordmark",
                    ),
                    html.Span(
                        f"Updated {updated.strftime('%H:%M')}", className="updated"
                    ),
                    html.P(headline(rows), className="summary"),
                ],
                className="hdr",
            ),
            html.Div(
                [
                    dcc.RadioItems(
                        id="sort",
                        options=[
                            {"label": "Deal", "value": "deal"},
                            {"label": "Price", "value": "price"},
                        ],
                        value="deal",
                        className="segmented",
                    ),
                    html.Span(id="count", className="count"),
                ],
                className="sortbar",
            ),
            dcc.RadioItems(
                id="store",
                options=stores,
                value="All stores",
                className="chips scroll",
            ),
            html.Div(id="deal-list", className="list scroll"),
        ],
        className="app",
    )


app.layout = serve_layout


@app.callback(
    Output("deal-list", "children"),
    Output("count", "children"),
    Input("sort", "value"),
    Input("store", "value"),
)
def render_list(sort, store):
    # ponytail: server round-trip per sort/filter tap. Cards are prebuilt from the
    # cached rows, so it is one render; go clientside only if it ever feels slow.
    rows, _ = load()
    shown = [r for r in rows if store == "All stores" or r["store"] == store]
    shown.sort(key=lambda r: r["price"] if sort == "price" else r["vs"])

    count = f"{len(rows)} tracked" if store == "All stores" else f"{len(shown)} of {len(rows)}"

    if not shown:
        next_step = (
            "Run the tracker to collect prices."
            if not rows
            else "Pick another store to see current deals."
        )
        return (
            html.Div(
                [
                    html.P("Nothing to show yet.", className="empty-title"),
                    html.P(next_step, className="empty-body"),
                ],
                className="empty",
            ),
            count,
        )

    # Best deal starts expanded on load; changing sort or store collapses everything.
    open_first = dash.ctx.triggered_id is None
    return [card(r, open_first and i == 0) for i, r in enumerate(shown)], count


if __name__ == "__main__":
    app.run(debug=True, dev_tools_ui=False)
