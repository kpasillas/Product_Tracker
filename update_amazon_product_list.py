#!/usr/bin/env python3

import logging
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from sqlalchemy import MetaData, Table, text
from time import sleep

logger = logging.getLogger(__name__)


def update_amazon_product_list(engine):

    productList = []
    urls = ["https://www.amazon.com/hz/wishlist/ls/1VHVB48YFSXWJ?ref_=wl_share"]

    options = Options()
    options.add_argument("--headless")
    options.add_argument("window-size=1400,1500")

    for url in urls:

        with webdriver.Chrome(options=options) as driver:
            wait = WebDriverWait(driver, 30)
            driver.get(url)

            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            sleep(10)

            list = wait.until(EC.presence_of_element_located((By.ID, "g-items")))

            listItems = list.find_elements(By.CSS_SELECTOR, "li")

            for item in listItems:
                links = item.find_elements(By.CLASS_NAME, "a-link-normal")

                if links:
                    textStrings = item.text.split("\n")

                    id = links[0].get_attribute("href").split("/")[4]
                    name = textStrings[
                        1 if re.search("Best Seller", textStrings[0]) else 0
                    ]

                    productList.append({"id": id, "name": name, "store": "Amazon"})

    query = text("DELETE FROM product WHERE store = 'Amazon'")
    with engine.begin() as connection:
        connection.execute(query)
        connection.execute(
            Table("product", MetaData(), autoload_with=engine).insert(), productList
        )
