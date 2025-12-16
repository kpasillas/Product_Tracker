#!/usr/bin/env python3

import logging
from sqlalchemy import MetaData, Table, text
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from time import sleep
from get_report_id import get_report_id

logger = logging.getLogger(__name__)


def get_product_price(url) -> float:

    MAX_RETRIES = 5
    RETRY_DELAY = 2

    options = Options()
    options.add_argument("--headless")
    options.add_argument("window-size=1400,1500")

    prices = {}

    with webdriver.Chrome(options=options) as driver:
        wait = WebDriverWait(driver, 10)

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                driver.get(url)

                toggles = wait.until(
                    EC.presence_of_all_elements_located(
                        (
                            By.CLASS_NAME,
                            "a-button.a-spacing-none.a-button-toggle.format",
                        )
                    )
                )
                for toggle in toggles:

                    prices[toggle.find_element(By.CLASS_NAME, "slot-title").text] = (
                        float(
                            toggle.find_element(By.CLASS_NAME, "slot-price").text.split(
                                "$"
                            )[-1]
                        )
                    )

                    extraMessage = toggle.find_elements(
                        By.CLASS_NAME, "slot-extraMessage"
                    )

                    if extraMessage and ("$" in extraMessage[0].text):
                        prices[
                            toggle.find_element(By.CLASS_NAME, "slot-title").text
                        ] = float(extraMessage[0].text.split("$")[1].split()[0])

                price = prices.get(
                    "Kindle", prices.get("Paperback", prices.get("Hardcover", 0.00))
                )

                return price

            except TimeoutException:
                if attempt == MAX_RETRIES:
                    return -1.0

                sleep(RETRY_DELAY)


def update_amazon_product_price(engine):

    productList = []
    reportID = get_report_id(engine)
    urlBase = "https://amazon.com/dp/"

    listQuery = text("SELECT id FROM product WHERE store = 'Amazon'")
    with engine.begin() as conn:
        result = conn.execute(listQuery)

    idList = [row.id for row in result]

    for product in idList:
        price = get_product_price(urlBase + product)

        productList.append(
            {"report_id": reportID.get("id"), "product_id": product, "price": price}
        )

    with engine.begin() as conn:
        conn.execute(
            Table("report", MetaData(), autoload_with=engine).insert(), reportID
        )
        conn.execute(
            Table("price", MetaData(), autoload_with=engine).insert(), productList
        )
