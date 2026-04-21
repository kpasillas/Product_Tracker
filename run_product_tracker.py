#!/usr/bin/env python3

from db.connection import get_mysql_engine
from get_report_id import get_report_id
from update_amazon_product_list import update_amazon_product_list
from update_amazon_product_price import update_amazon_product_price
from update_appletv_product_price import update_appletv_product_price

# from send_tracker_results import email_tracker_results

import logging
from logging_config import setup_logging


def main():
    setup_logging()
    logger = logging.getLogger(__name__)

    engine = get_mysql_engine()

    report_record = get_report_id(engine)

    logger.info("Amazon update start")

    logger.info("Updating Amazon product list...")
    update_amazon_product_list(engine)

    logger.info("Updating Amazon product prices...")
    update_amazon_product_price(engine, report_record)

    logger.info("Amazon update finish")

    # logger.info("Sending tracker results...")
    # email_tracker_results(engine)

    # logger.info("Sending tracker results complete")


if __name__ == "__main__":
    main()
