#!/bin/sh
set -e

mkdir -p /app/data

python - <<'PY'
from database import engine, Base
from models import User, Booking

Base.metadata.create_all(bind=engine)
print("Database tables are ready")
PY

exec uvicorn main:app --host 0.0.0.0 --port 8000
