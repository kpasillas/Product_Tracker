#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy import text


def get_report_id(engine):
    now = datetime.now()

    reportID = (
        now.strftime("%d") + chr(int(now.strftime("%m")) + 64) + now.strftime("%y")
    )

    query = text(
        f"SELECT id FROM report WHERE id LIKE '{reportID}%' ORDER BY timestamp DESC LIMIT 1"
    )

    with engine.begin() as connection:
        result = connection.execute(query)

    idList = [row.id for row in result]
    reportID += chr(ord(idList[0][-1]) + 1) if idList else "a"

    return {"id": reportID, "timestamp": now.strftime(format="%Y-%m-%d %H:%M:%S")}
