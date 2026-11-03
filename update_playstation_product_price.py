#!/usr/bin/env python3

import logging
from time import sleep
from typing import Dict, List

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

from sqlalchemy import MetaData, Table, text
from sqlalchemy.engine import Engine

from selenium_utils import create_webdriver, create_wait, safe_get, random_delay

logger = logging.getLogger(__name__)


PLAYSTATION_PRODUCT_URL_BASE = "https://store.playstation.com/en-us/product/"
# Current price of the main buy button, sale included
PRICE_SELECTOR = '[data-qa="mfeCtaMain#offer0#finalPrice"]'
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5


def _extract_price_from_page(wait) -> float:
    """
    Extract the price from a PlayStation Store product page.
    """
    try:
        element = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, PRICE_SELECTOR))
        )
        # "Free" / "Unavailable" fail the float() and fall through to -1.0
        price = float(element.text.replace("$", "").replace(",", ""))

    except:
        price = -1.0

    return price


def get_product_price(url: str) -> float:
    """
    Retrieve a product price from a PlayStation Store product page.

    Returns:
        float: price, or -1.0 after retry exhaustion
    """
    with create_webdriver() as driver:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                wait = create_wait(driver)
                safe_get(driver, url)
                random_delay()
                return _extract_price_from_page(wait)

            except TimeoutException:
                logger.warning(
                    "Timeout loading %s (attempt %d/%d)",
                    url,
                    attempt,
                    MAX_RETRIES,
                )

                if attempt == MAX_RETRIES:
                    logger.error("Max retries exceeded for %s", url)
                    return -1.0

                sleep(RETRY_DELAY_SECONDS)


def update_playstation_product_price(engine: Engine, report_record: Dict) -> None:
    """
    Fetch prices for all PlayStation products and store them in the database.
    """
    logger.info("Starting PlayStation product price update")

    report_id = report_record.get("id")

    with engine.begin() as connection:
        result = connection.execute(
            text("SELECT id FROM product WHERE store = 'PlayStation'")
        )
        product_ids = [row.id for row in result]

    if not product_ids:
        logger.warning("No PlayStation products found — skipping price update")
        return

    price_rows: List[Dict[str, float]] = []

    for product_id in product_ids:
        price = get_product_price(PLAYSTATION_PRODUCT_URL_BASE + product_id)

        price_rows.append(
            {
                "report_id": report_id,
                "product_id": product_id,
                "price": price,
            }
        )

    with engine.begin() as connection:
        connection.execute(
            Table("price", MetaData(), autoload_with=engine).insert(),
            price_rows,
        )

    logger.info("PlayStation product price update complete")
