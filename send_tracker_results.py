#!/usr/bin/env python3

import os
import certifi
from dotenv import load_dotenv
import logging
from typing import Dict, List
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import MetaData, Table, text
from sqlalchemy.engine import Engine

import sendgrid
from sendgrid.helpers.mail import Mail


logger = logging.getLogger(__name__)

os.environ["SSL_CERT_FILE"] = certifi.where()
AMAZON_PRODUCT_URL_BASE = "https://amazon.com/dp/"


def get_current_report_id(engine: Engine) -> str:
    """
    Fetch current report ID.
    """
    with engine.begin() as connection:
        result = connection.execute(
            text(
                "SELECT id FROM product_tracker.report ORDER BY timestamp DESC LIMIT 1"
            )
        )
        report_id = [row.id for row in result][0]

    return report_id


def get_current_product_prices(engine: Engine, report_id: str) -> Dict:
    """
    Fetch current prices for all products.
    """
    with engine.begin() as connection:
        result = connection.execute(
            text(
                "SELECT name, price, product.id AS id, store FROM price JOIN product ON price.product_id = product.id WHERE report_id = '{}' AND price > 0 ORDER BY price ASC".format(
                    report_id
                )
            )
        )

    keys = ("name", "price", "id", "store")
    product_prices = [dict(zip(keys, product)) for product in [row for row in result]]

    return product_prices


def get_average_product_prices(engine: Engine) -> List:
    """
    Fetch averaget prices for all products.
    """
    with engine.begin() as connection:
        result = connection.execute(
            text(
                "SELECT product_id AS id, ROUND(AVG(price), 2) AS average_price FROM price WHERE report_id IN (SELECT id FROM report WHERE timestamp >= NOW() - INTERVAL 3 MONTH AND timestamp != (SELECT MAX(timestamp) FROM report)) GROUP BY product_id"
            )
        )

    keys = ("id", "average_price")
    product_prices = [dict(zip(keys, product)) for product in [row for row in result]]

    return product_prices


def build_html_email(products):
    rows = ""

    for p in products:
        price = p["price"]
        avg = p["average_price"]

        # ---- pricing comparison ----
        if price < avg:
            color = "#2e7d32"  # green
        elif price > avg:
            color = "#c62828"  # red
        else:
            color = "#555555"  # neutral gray

        # ---- percentage difference ----
        if avg > 0:
            pct_diff = ((price - avg) / avg * 100).quantize(
                Decimal("0.1"), rounding=ROUND_HALF_UP
            )
        else:
            pct_diff = Decimal("0.0")

        if pct_diff < 0:
            pct_label = f"{abs(pct_diff)}% below average"
        elif pct_diff > 0:
            pct_label = f"{pct_diff}% above average"
        else:
            pct_label = "at average price"

        rows += f"""
        <tr>
          <td style="padding:16px;border-bottom:1px solid #eaeaea;">
            <h3 style="margin:0 0 8px 0;font-size:16px;color:#111;">
              {p["name"]}
            </h3>

            <p style="margin:4px 0;font-size:14px;">
              <strong>Current price:</strong>
              <span style="color:{color};font-weight:600;">
                ${price}
              </span>
              <span style="color:{color};font-size:13px;">
                ({pct_label})
              </span>
            </p>

            <p style="margin:4px 0;font-size:14px;">
              <strong>Average price:</strong>
              <span style="color:#666;">
                ${avg}
              </span>
            </p>

            <a href="{p["link"]}"
               style="
                 display:inline-block;
                 margin-top:10px;
                 padding:8px 14px;
                 background:#1976d2;
                 color:#ffffff;
                 text-decoration:none;
                 border-radius:4px;
                 font-size:14px;
               ">
              View product
            </a>
          </td>
        </tr>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Product Tracker Results</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:24px;">
            <table width="600" cellpadding="0" cellspacing="0"
                   style="background:#ffffff;border-radius:8px;overflow:hidden;">
              
              <tr>
                <td style="padding:20px;background:#111827;color:#ffffff;">
                  <h2 style="margin:0;font-size:20px;">
                    📉 Product Tracker Results
                  </h2>
                </td>
              </tr>

              {rows}

              <tr>
                <td style="padding:16px;font-size:12px;color:#666;text-align:center;">
                  Generated automatically by Product Tracker
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """


def email_tracker_results(engine: Engine) -> None:
    """
    Email product results.
    """
    logger.info("Starting Email Tracker Results")

    load_dotenv()

    report_id = get_current_report_id(engine)
    current_prices = get_current_product_prices(engine, report_id)
    average_prices = get_average_product_prices(engine)

    avg_price_by_id = {item["id"]: item["average_price"] for item in average_prices}

    combined_prices = [
        {**item, "average_price": avg_price_by_id.get(item["id"])}
        for item in current_prices
    ]

    for item in combined_prices:
        item.update({"deal_price": item["average_price"] * Decimal(0.8)})
        item.update(
            {
                "%_discount": (
                    (item["price"] - item["average_price"]) / item["average_price"]
                )
                * 100
            }
        )
        item.update({"link": f"{AMAZON_PRODUCT_URL_BASE}{item['id']}"})

    sorted_prices = sorted(
        combined_prices, key=lambda item: (item["price"], item["%_discount"])
    )

    sg = sendgrid.SendGridAPIClient(api_key=os.environ["SENDGRID_API_KEY"])

    html_content = build_html_email(sorted_prices)

    message = Mail(
        from_email="kristopher.pasillas@gmail.com",
        to_emails="kris@kris-p.net",
        subject="Product Update - {}".format(report_id),
        html_content=html_content,
    )

    sg.send(message)
