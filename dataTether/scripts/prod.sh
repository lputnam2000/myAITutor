#!/bin/bash

# Start Gunicorn
gunicorn 'app.server:gunicorn_app' \
    --bind 0.0.0.0:5050 \
    --workers 4 \
    --worker-class eventlet \
    --log-level debug \
    --access-logfile - \
    --error-logfile -