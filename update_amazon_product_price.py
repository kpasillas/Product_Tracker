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
from get_report_id import get_report_id

logger = logging.getLogger(__name__)


AMAZON_PRODUCT_URL_BASE = "https://amazon.com/dp/"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5


def _extract_price_from_page(wait) -> float:
    """
    Extract the most relevant price from an Amazon product page.

    Preference order:
        Kindle > Paperback > Hardcover
    """
    try:  # First try "books" format
        toggles = wait.until(
            EC.presence_of_all_elements_located(
                (By.CLASS_NAME, "a-button.a-spacing-none.a-button-toggle.format")
            )
        )

    except:  # Then check for "non-books" format
        price = -1.0

        box_groups = wait.until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "a-box-group"))
        )

        for box_group in box_groups:
            if box_group.find_elements(By.CLASS_NAME, "a-price-whole"):
                price = float(
                    box_group.find_elements(By.CLASS_NAME, "a-price-whole")[0].text
                    + "."
                    + box_group.find_elements(By.CLASS_NAME, "a-price-fraction")[0].text
                )
                break

        return price

    else:  # Execute "books" format logic
        prices: Dict[str, float] = {}

        for toggle in toggles:
            title = toggle.find_element(By.CLASS_NAME, "slot-title").text

            price_text = toggle.find_element(By.CLASS_NAME, "slot-price").text

            try:
                prices[title] = float(price_text.split("$")[-1])
            except (TypeError, ValueError):
                prices[title] = None

            extra_messages = toggle.find_elements(By.CLASS_NAME, "slot-extraMessage")
            if extra_messages and "$" in extra_messages[0].text:
                prices[title] = float(extra_messages[0].text.split("$")[1].split()[0])

        return prices.get(
            "Kindle",
            prices.get("Paperback", prices.get("Hardcover", -1.0)),
        )


def get_product_price(url: str) -> float:
    """
    Retrieve a product price from an Amazon product page.

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


def update_amazon_product_price(engine: Engine) -> None:
    """
    Fetch prices for all Amazon products and store them in the database.
    """
    logger.info("Starting Amazon product price update")

    report_record = get_report_id(engine)
    report_id = report_record.get("id")

    with engine.begin() as connection:
        result = connection.execute(
            text("SELECT id FROM product WHERE store = 'Amazon'")
        )
        product_ids = [row.id for row in result]

    if not product_ids:
        logger.warning("No Amazon products found — skipping price update")
        return

    price_rows: List[Dict[str, float]] = []

    for product_id in product_ids:
        price = get_product_price(AMAZON_PRODUCT_URL_BASE + product_id)

        price_rows.append(
            {
                "report_id": report_id,
                "product_id": product_id,
                "price": price,
            }
        )

    with engine.begin() as connection:
        connection.execute(
            Table("report", MetaData(), autoload_with=engine).insert(),
            report_record,
        )
        connection.execute(
            Table("price", MetaData(), autoload_with=engine).insert(),
            price_rows,
        )

    logger.info("Amazon product price update complete")
