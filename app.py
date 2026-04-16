import streamlit as st
import altair as alt
import pandas as pd
from db.connection import get_mysql_engine
from datetime import datetime
from zoneinfo import ZoneInfo

st.set_page_config(layout="wide")

st.title("🛒 Deal Tracker")

# conn = get_connection()
engine = get_mysql_engine()

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

current_query = f"""
    SELECT report_id, product.id AS product_id, name AS Name, price AS price_num, store AS Store
    FROM price JOIN product ON price.product_id = product.id
    WHERE
            report_id = "{report_id}"
        AND price >= 0
    ORDER BY price ASC
"""

current_df = pd.read_sql(current_query, engine)
product_id_list = tuple(current_df["product_id"].reset_index(drop=True).to_list())

avg_query = """
    SELECT product_id AS product_id, ROUND(AVG(price), 2) AS avg_price_num
    FROM price
    WHERE
        report_id IN (
            SELECT id
            FROM report
            WHERE
                    timestamp >= NOW() - INTERVAL 3 MONTH
                AND timestamp != (SELECT MAX(timestamp) FROM report)
        )
    GROUP BY product_id
"""

avg_df = pd.read_sql(avg_query, engine).set_index(keys="product_id")

current_df = current_df.join((avg_df), on="product_id")
current_df["pct_change"] = (
    current_df["price_num"] - current_df["avg_price_num"]
) / current_df["avg_price_num"]
current_df["Price"] = current_df["price_num"].map("${:,.2f}".format)
current_df["% Change"] = current_df["pct_change"].map("{:.2%}".format)

# Top deals
st.subheader("🔥 Best Deals")
st.caption(f"As of {report_date.strftime("%m/%d/%y %H:%M")}")
sorted_df = current_df.sort_values("price_num", ascending=True).loc[
    :, ["Name", "Price", "% Change", "Store"]
]
st.dataframe(sorted_df)

# Select product
product_list = pd.concat(
    [
        current_df["Name"].sort_values(ascending=True).iloc[:0],
        pd.DataFrame({"Name": ["All"]}),
        current_df["Name"].sort_values(ascending=True).iloc[0:],
    ]
).reset_index(drop=True)
product = st.selectbox("Select product", product_list)

single_item_history_query = f"""
    SELECT DATE(timestamp) AS Date, name AS Name, AVG(price) AS Price
    FROM (price JOIN product ON price.product_id = product.id) JOIN report on price.report_id = report.id
    WHERE product.name = "{product}"
    GROUP BY DATE(timestamp), name
"""

all_item_history_query = f"""
    SELECT DATE(timestamp) AS Date, AVG(price) AS Price
    FROM (price JOIN product ON price.product_id = product.id) JOIN report on price.report_id = report.id
    WHERE product.id IN {product_id_list}
    GROUP BY DATE(timestamp)
"""

history_df = pd.read_sql(
    all_item_history_query if product == "All" else single_item_history_query, engine
)

history_df["Date"] = pd.to_datetime(history_df["Date"])

st.subheader("📉 Price History")
st.line_chart(
    data=history_df.set_index("Date")["Price"], x_label="Date", y_label="Price"
)
