#!/usr/bin/env python3
"""Self-check for the derived deal logic. Run: python test_dash_app.py"""

from datetime import date, timedelta

from dash_app import (
    available_series,
    badge_for,
    chart,
    days_since_change,
    headline,
    relative_days,
)


def test_chart_scales_series_into_the_box():
    c = chart([10.0, 20.0, 15.0], 100, 50, 5)
    assert c["points"] == "0.0,45.0 50.0,5.0 100.0,25.0"
    assert (c["low_x"], c["low_y"]) == (0.0, 45.0)
    assert (c["high_x"], c["high_y"]) == (50.0, 5.0)
    assert (c["last_x"], c["last_y"]) == (100.0, 25.0)

    # Flat series: no division by zero, avg line clamped into the range.
    flat = chart([9.99, 9.99], 100, 50, 5, avg=9.99)
    assert flat["avg_y"] == 45.0
    # Single sample still renders a line.
    assert chart([9.99], 100, 50, 5)["points"] == "0.0,45.0 100.0,45.0"


def test_badge_ladder():
    assert badge_for(10.0, -0.30, 10.0, 20.0) == ("Lowest in 3 mo", "success", False)
    assert badge_for(11.0, -0.30, 10.0, 20.0) == ("Well below avg", "info", True)
    assert badge_for(11.0, -0.05, 10.0, 20.0) == ("Below avg", "neutral", True)
    assert badge_for(11.0, 0.00, 10.0, 20.0) == ("At average", "neutral", True)
    assert badge_for(11.0, 0.20, 10.0, 20.0) == ("Above avg", "neutral", True)
    # Never-changed price: ties its own low, but there is no low to be at.
    assert badge_for(10.0, 0.00, 10.0, 10.0) == ("At average", "neutral", True)


def test_days_since_change():
    days = [date.today() - timedelta(days=n) for n in (4, 3, 2, 1, 0)]
    assert days_since_change([5.0, 5.0, 4.0, 4.0, 4.0], days) == 2
    assert days_since_change([5.0, 5.0, 5.0, 5.0, 5.0], days) is None
    assert relative_days(2) == "2 days ago"
    assert relative_days(1) == "1 day ago"
    assert relative_days(0) == "Today"
    assert relative_days(None) == "3 mo+"


def test_available_series():
    days = [date.today() - timedelta(days=n) for n in (2, 1, 0)]

    # A gap mid-history is dropped; the item stays on the list.
    assert available_series([5.0, -1.0, 4.0], days) == ([5.0, 4.0], [days[0], days[2]])
    # Unavailable right now: off the list.
    assert available_series([5.0, 4.0, -1.0], days) is None
    assert available_series([], []) is None
    # Not yet scraped in a running report — yesterday's price still shows.
    assert available_series([5.0, 4.0], days[:2]) == ([5.0, 4.0], days[:2])


def test_headline():
    rows = [
        {"name": "Dune: Part Two", "badge": "Lowest in 3 mo", "vs": -0.3},
        {"name": "Oppenheimer", "badge": "Above avg", "vs": 0.1},
    ]
    assert headline(rows) == (
        "1 of 2 items are below their 3-month average. "
        "Dune is at its lowest price in 3 months."
    )
    rows[0].update(badge="Well below avg")
    assert headline(rows).endswith("Dune is 30.0% below its average.")
    assert headline([]) == "No tracked prices yet."


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
