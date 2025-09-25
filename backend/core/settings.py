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

    'rest_framework',
    'storages',

    'api.apps.ApiConfig',
]

# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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
}

# ==========================================
# CONFIGURACIÓN AUTOINCREMENTAL
# ==========================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'