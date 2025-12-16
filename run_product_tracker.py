#!/usr/bin/env python3

from db.connection import get_mysql_engine
from update_amazon_product_list import update_amazon_product_list
from update_amazon_product_price import update_amazon_product_price
import logging
from logging_config import setup_logging


def main():
    setup_logging()
    logger = logging.getLogger(__name__)

    engine = get_mysql_engine()

    logger.info("Updating Amazon product list...")
    update_amazon_product_list(engine)

    logger.info("Updating Amazon product prices...")
    update_amazon_product_price(engine)

    logger.info("Amazon update complete")


if __name__ == "__main__":
    main()
