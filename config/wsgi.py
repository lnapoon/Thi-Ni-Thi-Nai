import os
from pathlib import Path
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

BASE_DIR = Path(__file__).resolve().parent.parent

application = get_wsgi_application()
# Wrap with WhiteNoise directly to serve static files reliably in Serverless
application = WhiteNoise(application, root=str(BASE_DIR / 'static'), prefix='static/')
app = application
