"""
Django settings for "ที่นี่ Check-in" (Tee Nee Check-in) project.
"""

from pathlib import Path
import os

# pyrefly: ignore [missing-import]
from decouple import config, Csv
import dj_database_url
from django.contrib.messages import constants as messages

# pyrefly: ignore [missing-import]
import cloudinary


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings
_raw_secret_key = config("SECRET_KEY", default="").strip()
SECRET_KEY = (
    _raw_secret_key
    if _raw_secret_key
    else "django-insecure-thi-ni-thi-nai-rue-prod-secret-key-2026-xyz"
)
DEBUG = config("DEBUG", default=False, cast=bool)

MESSAGE_STORAGE = "django.contrib.messages.storage.session.SessionStorage"


# Allow all hosts in production/serverless environments
raw_allowed_hosts = config("ALLOWED_HOSTS", default="*", cast=Csv())
ALLOWED_HOSTS = list(raw_allowed_hosts) if raw_allowed_hosts else ["*"]
if "testserver" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append("testserver")
if "*" not in ALLOWED_HOSTS and ".vercel.app" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.extend([".vercel.app", "localhost", "127.0.0.1", "*"])
if "testserver" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append("testserver")

CSRF_TRUSTED_ORIGINS = [
    "https://*.vercel.app",
    "https://*.onrender.com",
    "https://*.railway.app",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
extra_csrf = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())
if extra_csrf:
    CSRF_TRUSTED_ORIGINS.extend(extra_csrf)

# Reverse Proxy & HTTPS detection for Vercel / Render / Cloudflare
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True


# ─────────────────────────────────────────────────────────────
# Cloudinary SDK configuration (direct — NO django-cloudinary-storage)
# ─────────────────────────────────────────────────────────────
_cloud_name = config("CLOUDINARY_CLOUD_NAME", default="").strip() or "pkxxxmpn"
_api_key = config("CLOUDINARY_API_KEY", default="").strip() or "213872343661713"
_api_secret = (
    config("CLOUDINARY_API_SECRET", default="").strip() or "Homv6qBkjPWUiI8X-qcSAWFZ60c"
)

cloudinary.config(
    cloud_name=_cloud_name,
    api_key=_api_key,
    api_secret=_api_secret,
    secure=True,
)

CLOUDINARY_CLOUD_NAME = _cloud_name


# Application definition — no cloudinary_storage needed
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    # Local apps
    "accounts.apps.AccountsConfig",
    "checkins.apps.CheckinsConfig",
]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "config.middleware.DebugExceptionMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "config.middleware.RestrictAdminMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


# ─────────────────────────────────────────────────────────────
# Static files (CSS, JavaScript, Images)
# ─────────────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
os.makedirs(STATIC_ROOT, exist_ok=True)


# ─────────────────────────────────────────────────────────────
# Database configuration (Neon PostgreSQL)
# ─────────────────────────────────────────────────────────────
NEON_FALLBACK_DB = "postgresql://neondb_owner:npg_SL6FjAmClNi1@ep-dark-waterfall-azi5el2q-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
_raw_db_url = config("DATABASE_URL", default=NEON_FALLBACK_DB).strip()
DATABASE_URL = _raw_db_url if _raw_db_url else NEON_FALLBACK_DB

clean_db_url = (
    DATABASE_URL.replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "")
    .replace("channel_binding=require", "")
)

DATABASES = {
    "default": dj_database_url.parse(
        clean_db_url,
        conn_max_age=600,
        ssl_require=True,
    )
}

# In-Memory cache for high-speed queries & sessions
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "thi-ni-locmem-cache",
        "TIMEOUT": 300,
    }
}

# Static file caching & compression (1 year cache for static assets)
WHITENOISE_MAX_AGE = 31536000
WHITENOISE_USE_FINDERS = True



# ─────────────────────────────────────────────────────────────
# Media — Cloudinary handles all media, no local filesystem
# ─────────────────────────────────────────────────────────────
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Authentication URLs
LOGIN_URL = "accounts:login"
LOGIN_REDIRECT_URL = "checkins:feed"
LOGOUT_REDIRECT_URL = "accounts:login"

# Bootstrap Alert Message Mapping
MESSAGE_TAGS = {
    messages.DEBUG: "secondary",
    messages.INFO: "info",
    messages.SUCCESS: "success",
    messages.WARNING: "warning",
    messages.ERROR: "danger",
}

# ─────────────────────────────────────────────────────────────
# Email Configuration (Gmail SMTP)
# ─────────────────────────────────────────────────────────────
EMAIL_BACKEND = config("EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default=f'"ที่นี่ Check-in" <{EMAIL_HOST_USER}>')
