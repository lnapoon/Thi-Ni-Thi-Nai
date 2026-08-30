"""
Django settings for "Thi Ni Thi Nai Rue" (ที่นี้ที่ไหนหรือ) project.
"""

from pathlib import Path

# pyrefly: ignore [missing-import]
from decouple import config, Csv
import dj_database_url
from django.contrib.messages import constants as messages


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings
_raw_secret_key = config('SECRET_KEY', default='').strip()
SECRET_KEY = _raw_secret_key if _raw_secret_key else 'django-insecure-thi-ni-thi-nai-rue-prod-secret-key-2026-xyz'
DEBUG = config('DEBUG', default=False, cast=bool)

MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'


# Allow all hosts in production/serverless environments to avoid 400 Bad Request
raw_allowed_hosts = config('ALLOWED_HOSTS', default='*', cast=Csv())
ALLOWED_HOSTS = list(raw_allowed_hosts) if raw_allowed_hosts else ['*']
if '*' not in ALLOWED_HOSTS and '.vercel.app' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.extend(['.vercel.app', 'localhost', '127.0.0.1', '*'])

CSRF_TRUSTED_ORIGINS = [
    'https://*.vercel.app',
    'https://*.onrender.com',
    'https://*.railway.app',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
extra_csrf = config('CSRF_TRUSTED_ORIGINS', default='', cast=Csv())
if extra_csrf:
    CSRF_TRUSTED_ORIGINS.extend(extra_csrf)


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    # Third-party apps
    "storages",
    # Local apps
    "accounts.apps.AccountsConfig",
    "checkins.apps.CheckinsConfig",
]

# Conditionally insert cloudinary apps if available/configured
STORAGE_BACKEND = config("STORAGE_BACKEND", default="cloudinary").lower()
if STORAGE_BACKEND == "cloudinary":
    # Cloudinary storage needs to be before staticfiles in some configs or media only
    INSTALLED_APPS.insert(0, "cloudinary_storage")
    INSTALLED_APPS.append("cloudinary")


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "config.middleware.DebugExceptionMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
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
                "django.template.context_processors.media",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

import os

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
os.makedirs(STATIC_ROOT, exist_ok=True)

# Database configuration
NEON_FALLBACK_DB = "postgresql://neondb_owner:npg_SL6FjAmClNi1@ep-dark-waterfall-azi5el2q-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
_raw_db_url = config("DATABASE_URL", default=NEON_FALLBACK_DB).strip()
DATABASE_URL = _raw_db_url if _raw_db_url else NEON_FALLBACK_DB

# Strip channel_binding if present to prevent libpq SCRAM-PLUS compatibility errors on AWS Lambda / Vercel
clean_db_url = (
    DATABASE_URL.replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "")
    .replace("channel_binding=require", "")
)

DATABASES = {
    "default": dj_database_url.parse(
        clean_db_url,
        conn_max_age=0,
        ssl_require=True,
    )
}



# Media files & Pluggable Storage configuration
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Configure STORAGES (Django 4.2+)
STATICFILES_STORAGE_BACKEND = "whitenoise.storage.CompressedStaticFilesStorage"
WHITENOISE_USE_FINDERS = True

import cloudinary

if STORAGE_BACKEND == "cloudinary":
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default="pkxxxmpn"),
        "API_KEY": config("CLOUDINARY_API_KEY", default="213872343661713"),
        "API_SECRET": config("CLOUDINARY_API_SECRET", default="Homv6qBkjPWUiI8X-qcSAWFZ60c"),
    }
    cloudinary.config(
        cloud_name=CLOUDINARY_STORAGE["CLOUD_NAME"],
        api_key=CLOUDINARY_STORAGE["API_KEY"],
        api_secret=CLOUDINARY_STORAGE["API_SECRET"],
        secure=True,
    )
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
    STORAGES = {
        "default": {
            "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
        },
        "staticfiles": {
            "BACKEND": STATICFILES_STORAGE_BACKEND,
        },
    }


elif STORAGE_BACKEND == "s3":
    # AWS S3 / Cloudflare R2 / Backblaze B2 support
    AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", default="")
    AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", default="")
    AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", default="")
    AWS_S3_REGION_NAME = config("AWS_S3_REGION_NAME", default=None)
    AWS_S3_ENDPOINT_URL = config("AWS_S3_ENDPOINT_URL", default=None)
    AWS_S3_CUSTOM_DOMAIN = config("AWS_S3_CUSTOM_DOMAIN", default=None)
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False

    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        },
        "staticfiles": {
            "BACKEND": STATICFILES_STORAGE_BACKEND,
        },
    }
else:
    # Local filesystem storage (Default)
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": STATICFILES_STORAGE_BACKEND,
        },
    }


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
