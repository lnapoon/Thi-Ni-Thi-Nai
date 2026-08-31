web: gunicorn config.wsgi:application --workers 3 --threads 2 --worker-class gthread --timeout 60 --keep-alive 5 --bind 0.0.0.0:$PORT
release: python manage.py migrate --noinput

