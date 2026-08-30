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
SECRET_KEY = config(
    "SECRET_KEY", default="django-insecure-thi-ni-thi-nai-rue-fallback-key-2026"
)
DEBUG = config("DEBUG", default=True, cast=bool)

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
STORAGE_BACKEND = config("STORAGE_BACKEND", default="local").lower()
if STORAGE_BACKEND == "cloudinary":
    # Cloudinary storage needs to be before staticfiles in some configs or media only
    INSTALLED_APPS.insert(0, "cloudinary_storage")
    INSTALLED_APPS.append("cloudinary")

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
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

# Database configuration
DATABASE_URL = config("DATABASE_URL", default="")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 6,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "th-th"
TIME_ZONE = "Asia/Bangkok"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files & Pluggable Storage configuration
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Configure STORAGES (Django 4.2+)
STATICFILES_STORAGE_BACKEND = "whitenoise.storage.CompressedStaticFilesStorage"
WHITENOISE_USE_FINDERS = True

if STORAGE_BACKEND == "cloudinary":
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default=""),
        "API_KEY": config("CLOUDINARY_API_KEY", default=""),
        "API_SECRET": config("CLOUDINARY_API_SECRET", default=""),
    }
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
