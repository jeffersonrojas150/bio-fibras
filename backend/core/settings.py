import os
from pathlib import Path
from dotenv import load_dotenv
from google.oauth2 import service_account

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'admin_interface',
    'colorfield',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'rest_framework',
    'rest_framework.authtoken',
    'storages',
    'django_filters',

    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'api.apps.ApiConfig',
    'corsheaders',
]

# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'core.urls'

# ==========================================
# TEMPLATES
# ==========================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ==========================================
# BASE DE DATOS
# ==========================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# ==========================================
# VALIDACIÓN DE CONTRASEÑAS
# ==========================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==========================================
# INTERNACIONALIZACIÓN
# ==========================================
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True

# ==========================================
# ARCHIVOS ESTÁTICOS
# ==========================================
STATIC_URL = 'static/'
# NOTA: STATIC_ROOT será necesario para producción. Por ahora está bien así.

# ==========================================
# CONFIGURACIÓN DE GOOGLE CLOUD STORAGE (PARA ARCHIVOS MEDIA)
# ==========================================
GS_BUCKET_NAME = os.getenv('GS_BUCKET_NAME')
GS_PROJECT_ID = os.getenv('GS_PROJECT_ID')
CREDENTIALS_PATH = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

if CREDENTIALS_PATH and os.path.exists(CREDENTIALS_PATH):
    GS_CREDENTIALS = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
else:
    GS_CREDENTIALS = None # Permite que la app funcione aunque no encuentre credenciales (útil para otros entornos)

# Sintaxis moderna de Django 4.2+ para configurar el almacenamiento por defecto.
STORAGES = {
    'default': {
        'BACKEND': 'storages.backends.gcloud.GoogleCloudStorage',
    },
    'staticfiles': { # Mantenemos el default para archivos estáticos (se sirven localmente en DEV)
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    }
}

# Configuraciones adicionales de GCS
GS_DEFAULT_ACL = None # Clave para que funcione con permisos de bucket "Uniforme" o "Preciso".
GS_FILE_OVERWRITE = False # No sobreescribir archivos con el mismo nombre.

# URL pública de nuestros archivos multimedia ahora apunta directamente a GCS.
MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/'
# MEDIA_ROOT ya no es necesario, Django Storages lo gestiona internamente.

# ==========================================
# CONFIGURACIÓN DE DJANGO REST FRAMEWORK
# ==========================================
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = [
    'api.backends.EmailBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')

SITE_ID = 1


# ==========================================
# CONFIGURACIÓN DE DJANGO-ALLAUTH Y DJ-REST-AUTH (SINTAXIS MODERNA)
# ==========================================

REST_USE_JWT = True
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_SIGNUP_FIELDS = {
    'email': {
        'required': True,
    },
    'username': {
        'required': False,
    }
}
ACCOUNT_LOGIN_METHODS = {'email'}
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv('GOOGLE_OAUTH2_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_OAUTH2_CLIENT_SECRET'),
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}
# ==========================================
# CONFIGURACIÓN EXPLÍCITA DE DJ-REST-AUTH PARA USAR JWT
# ==========================================
REST_AUTH = {
    'SESSION_LOGIN': False,
    'JWT_SERIALIZER': 'dj_rest_auth.serializers.JWTSerializer',
}