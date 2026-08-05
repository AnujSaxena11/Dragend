import crypto from "../../utils/crypto.js";

export function generateRequirementsTxt(dbType) {
    let reqs = `Django==5.0.3\ndjangorestframework==3.15.1\ndjango-cors-headers==4.3.1\npython-dotenv==1.0.1\n`;

    if (dbType === 'postgresql') {
        reqs += `psycopg2-binary==2.9.9\n`;
    } else if (dbType === 'mysql') {
        reqs += `mysqlclient==2.2.4\n`;
    } else if (dbType === 'mongodb') {
        // Djongo is the standard translation layer for using Django ORM with MongoDB
        reqs += `djongo==3.2.10\npymongo==3.12.3\n`;
    }

    return reqs;
};

export function generateDotEnv(port, dbType, dbConfig, dbName) {
    let envContent = `PORT=${port}\nSECRET_KEY=django-insecure-generate-a-secure-key-in-prod\nDEBUG=True\n`;
    if (!dbConfig) return envContent + `# DB Config Missing`;

    const creds = dbConfig.credentials || {};
    let password = creds.password;
    try { password = crypto.decrypt(creds.password); } catch (e) { }
    const databaseName = dbName || 'myapp';

    envContent += `DB_NAME=${databaseName}\n`;
    envContent += `DB_USER=${creds.username || 'root'}\n`;
    envContent += `DB_PASS=${password || ''}\n`;
    envContent += `DB_HOST=${creds.host || 'localhost'}\n`;
    envContent += `DB_PORT=${creds.port || (dbType === 'postgresql' ? 5432 : 3306)}\n`;

    return envContent;
};

export function generateManagePy() {
    return `#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`;
};

export function generateSettings(dbType) {
    let dbEngine = 'django.db.backends.sqlite3';
    if (dbType === 'postgresql') dbEngine = 'django.db.backends.postgresql';
    else if (dbType === 'mysql') dbEngine = 'django.db.backends.mysql';
    else if (dbType === 'mongodb') dbEngine = 'djongo';

    return `import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api', # Generated App
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': '${dbEngine}',
        'NAME': os.getenv('DB_NAME', 'myapp'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASS', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', ''),
    }
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
`;
};

export function generateCoreUrls() {
    return `from django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('api/', include('api.urls')),\n]\n`;
};

export function generateModels(tables) {
    let code = `from django.db import models\nimport uuid\n\n`;

    tables.forEach(table => {
        code += `class ${table.name}(models.Model):\n`;
        let hasFields = false;

        table.fields.forEach(f => {
            if (f.constraint === 'primary' && f.name === 'id') return; // Django handles ID automatically unless specified otherwise
            hasFields = true;

            let fieldType = `models.CharField(max_length=${f.maxLength || 255})`;
            if (f.type === 'number') fieldType = f.type.includes('.') ? `models.FloatField()` : `models.IntegerField()`;
            if (f.type === 'boolean') fieldType = `models.BooleanField(default=False)`;
            if (f.type === 'date') fieldType = `models.DateTimeField(auto_now_add=True)`;
            if (f.isUuid) fieldType = `models.UUIDField(default=uuid.uuid4, editable=False)`;
            if (f.constraint === 'foreign' && f.targetTable) fieldType = `models.ForeignKey('${f.targetTable}', on_delete=models.CASCADE)`;

            let props = [];
            if (!f.required && f.type !== 'boolean') props.push('null=True', 'blank=True');
            if (f.unique) props.push('unique=True');
            if (f.defaultValue && f.type !== 'boolean' && f.type !== 'date') props.push(`default='${f.defaultValue}'`);

            let propsStr = props.length > 0 ? `, ${props.join(', ')}` : '';
            if (fieldType.includes('(')) {
                fieldType = fieldType.replace(')', `${propsStr})`);
            }

            code += `    ${f.name} = ${fieldType}\n`;
        });

        if (!hasFields) code += `    pass\n`;
        code += `\n    def __str__(self):\n        return str(self.id)\n\n`;
    });

    return code;
};

export function generateSerializers(tables) {
    let code = `from rest_framework import serializers\nfrom .models import *\n\n`;
    tables.forEach(table => {
        code += `class ${table.name}Serializer(serializers.ModelSerializer):\n`;
        code += `    class Meta:\n`;
        code += `        model = ${table.name}\n`;
        code += `        fields = '__all__'\n\n`;
    });
    return code;
};

export function generateViews(groupedEndpoints) {
    let code = `from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom .models import *\nfrom .serializers import *\n\n`;

    Object.keys(groupedEndpoints).forEach(tableName => {
        const endpoints = groupedEndpoints[tableName];

        endpoints.forEach(ep => {
            const funcName = ep.route.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_') || 'root';
            const method = ep.method.toUpperCase();

            code += `@api_view(['${method}'])\ndef ${method.toLowerCase()}_${funcName}(request):\n`;

            if (method === 'GET') {
                code += `    items = ${tableName}.objects.all()\n`;
                code += `    serializer = ${tableName}Serializer(items, many=True)\n`;
                code += `    return Response(serializer.data)\n\n`;
            } else if (method === 'POST') {
                code += `    serializer = ${tableName}Serializer(data=request.data)\n`;
                code += `    if serializer.is_valid():\n`;
                code += `        serializer.save()\n`;
                code += `        return Response(serializer.data, status=status.HTTP_201_CREATED)\n`;
                code += `    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)\n\n`;
            } else {
                code += `    return Response({"msg": "${method} endpoint hit"})\n\n`;
            }
        });
    });

    return code;
};

export function generateApiUrls(groupedEndpoints) {
    let code = `from django.urls import path\nfrom . import views\n\nurlpatterns = [\n`;

    Object.keys(groupedEndpoints).forEach(tableName => {
        const endpoints = groupedEndpoints[tableName];
        endpoints.forEach(ep => {
            const funcName = ep.route.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_') || 'root';
            const method = ep.method.toLowerCase();
            const routePath = ep.route.startsWith('/') ? ep.route.substring(1) : ep.route;

            code += `    path('${routePath}', views.${method}_${funcName}, name='${method}_${funcName}'),\n`;
        });
    });

    code += `]\n`;
    return code;
};

export function generateDjangoProject(zip, data) {
    const { project, dbType, dbConfig, dbName, tables, groupedEndpoints } = data;

    zip.file("requirements.txt", generateRequirementsTxt(dbType));
    zip.file(".env", generateDotEnv(8080, dbType, dbConfig, dbName));
    zip.file("manage.py", generateManagePy());
    zip.file("README.md", `# ${project.name}\nGenerated Django REST Framework Project\n\nRun:\n\`pip install -r requirements.txt\`\n\`python manage.py makemigrations\`\n\`python manage.py migrate\`\n\`python manage.py runserver\``);

    const coreFolder = zip.folder("core");
    coreFolder.file("__init__.py", "");
    coreFolder.file("settings.py", generateSettings(dbType));
    coreFolder.file("urls.py", generateCoreUrls());
    coreFolder.file("wsgi.py", `import os\nfrom django.core.wsgi import get_wsgi_application\nos.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')\napplication = get_wsgi_application()\n`);
    coreFolder.file("asgi.py", `import os\nfrom django.core.asgi import get_asgi_application\nos.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')\napplication = get_asgi_application()\n`);

    const apiFolder = zip.folder("api");
    apiFolder.file("__init__.py", "");
    apiFolder.file("apps.py", `from django.apps import AppConfig\n\nclass ApiConfig(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = 'api'\n`);
    apiFolder.file("models.py", generateModels(tables));
    apiFolder.file("serializers.py", generateSerializers(tables));
    apiFolder.file("views.py", generateViews(groupedEndpoints));
    apiFolder.file("urls.py", generateApiUrls(groupedEndpoints));
    apiFolder.file("admin.py", `from django.contrib import admin\nfrom .models import *\n\n# Register your models here.\n`);
};