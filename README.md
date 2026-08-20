# Product_Tracker
Tool for tracking change of prices for various items over time.

## Deploying the Deal Tracker

The Dash app runs on `kris_p` from `/home/kpasillas/Product_Tracker`, served by
`dealtracker.service`:

    gunicorn dash_app:server --bind 127.0.0.1:8050 --workers 2

To ship a change merged to `main`:

    ssh kris_p
    cd ~/Product_Tracker && git pull --ff-only
    sudo systemctl restart dealtracker.service

The restart is required — gunicorn runs without `--reload`, so a pull alone
keeps serving the old code. Check it came back with
`systemctl status dealtracker.service` and `curl -I http://127.0.0.1:8050/`.

Locally, `.venv/bin/python dash_app.py` serves the same app on port 8050
against the `.env` database.
