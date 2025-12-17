import os

from sqlalchemy import create_engine
from sqlalchemy.engine import URL


def get_mysql_engine():

    connection_url = URL.create(
        "mysql+pymysql",
        username=os.getenv("MYSQL_USERNAME"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("MYSQL_HOST"),
        database="product_tracker",
    )
    engine = create_engine(
        connection_url,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

    return engine
