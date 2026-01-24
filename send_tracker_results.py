#!/usr/bin/env python3

import logging
from typing import Dict, List
from email.message import EmailMessage
import smtplib
import os
from dotenv import load_dotenv

from sqlalchemy import MetaData, Table, text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)


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


def get_current_product_prices(engine: Engine, report_id: str) -> List:
    """
    Fetch current prices for all products.
    """
    with engine.begin() as connection:
        result = connection.execute(
            text(
                "SELECT name, price, product.id AS id, store FROM price JOIN product ON price.product_id = product.id WHERE report_id = '{}' ORDER BY price ASC".format(
                    report_id
                )
            )
        )
        product_prices = [row for row in result]

    return product_prices


def email_tracker_results(engine: Engine) -> None:
    """
    Email product results.
    """
    logger.info("Starting Email Tracker Results")

    load_dotenv()

    GMAIL_APP_PASSSWORD = os.getenv("GMAIL_APP_PASSWORD")

    report_id = get_current_report_id(engine)
    products = get_current_product_prices(engine, report_id)

    body = "".join(
        f"\t- {product[0]}: ${product[1]} ({AMAZON_PRODUCT_URL_BASE}{product[2]})\n"
        for product in products
        if product[1] < 10.0
    )

    msg = EmailMessage()
    msg["From"] = "kristopher.pasillas@gmail.com"
    msg["To"] = "kris@kris-p.net"
    msg["Subject"] = "Product Update - {}".format(report_id)
    msg.set_content(
        f"""Hi,

    Here are today’s updates:

    {body}

    Best,
    Product Tracker
    """
    )

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("kristopher.pasillas@gmail.com", GMAIL_APP_PASSSWORD)
        server.send_message(msg)
