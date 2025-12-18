#!/usr/bin/env python3

import logging
import re
from time import sleep
from typing import Dict, List

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from selenium_utils import create_webdriver, wait_for_amazon_wishlist_items

from sqlalchemy import MetaData, Table, text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)


AMAZON_WISHLIST_URLS = [
    "https://www.amazon.com/hz/wishlist/ls/1VHVB48YFSXWJ?ref_=wl_share"
]


def scroll_until_complete(driver, pause_seconds: float = 1.5, max_attempts: int = 20):
    """
    Scroll down until no new content loads.
    """
    last_height = 0

    for _ in range(max_attempts):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(pause_seconds)

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            return

        last_height = new_height


def _extract_products_from_page(driver) -> List[Dict[str, str]]:
    """Extract product records from the current wishlist page."""
    wait_for_amazon_wishlist_items(driver)

    items_container = driver.find_element(By.ID, "g-items")

    products: List[Dict[str, str]] = []

    for item in items_container.find_elements(By.CSS_SELECTOR, "li"):
        links = item.find_elements(By.CLASS_NAME, "a-link-normal")
        if not links:
            continue

        text_lines = item.text.split("\n")

        try:
            product_id = links[0].get_attribute("href").split("/")[4]
        except (IndexError, AttributeError):
            logger.warning("Failed to parse product ID, skipping item")
            continue

        name_index = 1 if re.search("Best Seller", text_lines[0]) else 0

        products.append(
            {
                "id": product_id,
                "name": text_lines[name_index],
                "store": "Amazon",
            }
        )

    return products


def update_amazon_product_list(engine: Engine) -> None:
    """
    Refresh the Amazon product list in the database.
    """
    logger.info("Starting Amazon product list update")

    all_products: List[Dict[str, str]] = []

    for url in AMAZON_WISHLIST_URLS:
        logger.info("Loading wishlist URL: %s", url)

        with create_webdriver() as driver:
            driver.get(url)

            # Force lazy-loaded items to render
            scroll_until_complete(driver)

            products = _extract_products_from_page(driver)
            all_products.extend(products)

            logger.info("Extracted %d products", len(products))

    if not all_products:
        logger.warning("No Amazon products found — skipping DB update")
        return

    product_table = Table("product", MetaData(), autoload_with=engine)

    with engine.begin() as connection:
        connection.execute(text("DELETE FROM product WHERE store = 'Amazon'"))
        connection.execute(product_table.insert(), all_products)

    logger.info("Amazon product list update complete")
