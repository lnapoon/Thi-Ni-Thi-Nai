#!/usr/bin/env bash
# Build script for Vercel
echo "=== Building project for Vercel ==="
python3 -m pip install --break-system-packages -r requirements.txt
python3 manage.py collectstatic --no-input
echo "=== Build finished successfully ==="
