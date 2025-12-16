#!/usr/bin/env python3

from sqlalchemy import create_engine
from sqlalchemy.engine import URL

def get_mysql_engine():

    connection_url = URL.create(
        "mysql+pymysql",
        username="kpasillas",
        password="jeri$cho-CREATE5-noose",
        host="172.233.150.156",
        database="product_tracker",
        # query={'charset': 'utf8'},
    )
    engine = create_engine(
        connection_url,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=3600
        # isolation_level='AUTOCOMMIT'
    )

    return engine