import streamlit as st
import pandas as pd
from db import get_connection

st.set_page_config(layout="wide")

st.title("🛒 Deal Tracker")

conn = get_connection()

df = pd.read_sql("SELECT * FROM deal_metrics", conn)

# Top deals
st.subheader("🔥 Best Deals")
df_sorted = df.sort_values("pct_below_avg", ascending=False)
st.dataframe(df_sorted)

# Select product
product = st.selectbox("Select product", df["name"])

price_df = pd.read_sql(
    f"""
        SELECT pr.date, pr.price
        FROM prices pr
        JOIN products p ON p.id = pr.product_id
        WHERE p.name = '{product}'
        ORDER BY pr.date
    """,
    conn,
)

price_df["date"] = pd.to_datetime(price_df["date"])

st.subheader("📉 Price History")
st.line_chart(price_df.set_index("date")["price"])
