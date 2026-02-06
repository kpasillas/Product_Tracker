#!/usr/bin/env python3

from db.connection import get_mysql_engine
from update_amazon_product_list import update_amazon_product_list
from update_amazon_product_price import update_amazon_product_price
from send_tracker_results import email_tracker_results
import logging
from logging_config import setup_logging


def main():
    setup_logging()
    logger = logging.getLogger(__name__)

    engine = get_mysql_engine()

    logger.info("Updating Amazon product list...")
    update_amazon_product_list(engine)

    # logger.info("Updating Amazon product prices...")
    # update_amazon_product_price(engine)

    # logger.info("Amazon update complete")

    # logger.info("Sending tracker results...")
    # email_tracker_results(engine)

    # logger.info("Sending tracker results complete")


if __name__ == "__main__":
    main()
