import crypto from "../../utils/crypto.js";

export function generateRequirementsTxt(dbType, tables) {
    let reqs = `Flask==3.0.2\nFlask-Cors==4.0.0\npython-dotenv==1.0.1\n`;

    if (dbType === 'mongodb') {
        reqs += `Flask-PyMongo==2.3.0\n`;
    } else {
        reqs += `Flask-SQLAlchemy==3.1.1\nFlask-Marshmallow==0.15.0\nmarshmallow-sqlalchemy==0.29.0\n`;
        if (dbType === 'postgresql') {
            reqs += `psycopg2-binary==2.9.9\n`;
        } else {
            reqs += `pymysql==1.1.0\ncryptography==42.0.5\n`; // pymysql requires cryptography for some auth plugins
        }
    }

    const needsHashing = tables.some(t => t.fields.some(f => f.isHashed));
    if (needsHashing) reqs += `passlib[bcrypt]==1.7.4\n`;

    return reqs;
};

export function generateFlaskEnv(port, dbType, dbConfig, dbName) {
    let envContent = `PORT=${port}\nFLASK_DEBUG=1\nSECRET_KEY=super-secret-flask-key\n`;
    if (!dbConfig) return envContent + `# DB Config Missing`;

    const creds = dbConfig.credentials || {};
    let password = creds.password;
    try { password = crypto.decrypt(creds.password); } catch (e) { }
    const databaseName = dbName || 'myapp';

    if (dbType === 'mongodb') {
        const uri = dbConfig.uri || `mongodb://${creds.host || 'localhost'}:${creds.port || 27017}/${databaseName}`;
        envContent += `MONGO_URI=${uri}\n`;
    } else {
        const dialect = dbType === 'postgresql' ? 'postgresql' : 'mysql+pymysql';
        const host = creds.host || 'localhost';
        const portNum = creds.port || (dbType === 'postgresql' ? 5432 : 3306);
        const user = creds.username || 'root';
        const dbUrl = `${dialect}://${user}:${password}@${host}:${portNum}/${databaseName}`;
        envContent += `DATABASE_URI=${dbUrl}\n`;
    }
    return envContent;
};

export function generateRunPy() {
    return `import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG') == '1')
`;
};

export function generateAppInit(dbType, blueprintNames) {
    let code = `import os\nfrom flask import Flask\nfrom flask_cors import CORS\n`;

    if (dbType === 'mongodb') {
        code += `from flask_pymongo import PyMongo\n\nmongo = PyMongo()\n\n`;
    } else {
        code += `from flask_sqlalchemy import SQLAlchemy\nfrom flask_marshmallow import Marshmallow\n\ndb = SQLAlchemy()\nma = Marshmallow()\n\n`;
    }

    code += `def create_app():\n`;
    code += `    app = Flask(__name__)\n`;
    code += `    CORS(app)\n\n`;

    if (dbType === 'mongodb') {
        code += `    app.config["MONGO_URI"] = os.environ.get("MONGO_URI")\n`;
        code += `    mongo.init_app(app)\n\n`;
    } else {
        code += `    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI")\n`;
        code += `    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False\n`;
        code += `    db.init_app(app)\n`;
        code += `    ma.init_app(app)\n\n`;
        code += `    with app.app_context():\n`;
        code += `        db.create_all()\n\n`;
    }

    code += `    # Register Blueprints\n`;
    blueprintNames.forEach(name => {
        code += `    from app.routes.${name.toLowerCase()}_routes import ${name.toLowerCase()}_bp\n`;
        code += `    app.register_blueprint(${name.toLowerCase()}_bp, url_prefix='/api/${name.toLowerCase()}')\n`;
    });

    code += `\n    @app.route('/api')\n`;
    code += `    def index():\n`;
    code += `        return {"message": "Welcome to the Generated Flask API"}\n\n`;

    code += `    return app\n`;
    return code;
};

export function generateModelsAndSchemas(tables, dbType) {
    if (dbType === 'mongodb') return { models: '', schemas: '' }; // PyMongo uses dictionaries directly

    let modelsCode = `from app import db\nimport uuid\n\n`;
    let schemasCode = `from app import ma\nfrom app.models import *\n\n`;

    tables.forEach(table => {
        // --- Models ---
        modelsCode += `class ${table.name}(db.Model):\n`;
        modelsCode += `    __tablename__ = '${table.name.toLowerCase()}s'\n\n`;

        let hasPk = false;
        table.fields.forEach(f => {
            let colType = `db.String(255)`;
            if (f.type === 'number') colType = f.type.includes('.') ? `db.Float` : `db.Integer`;
            if (f.type === 'boolean') colType = `db.Boolean`;
            if (f.type === 'date') colType = `db.DateTime, default=db.func.current_timestamp()`;
            if (f.isUuid) colType = `db.String(36), default=lambda: str(uuid.uuid4())`;

            let props = [];
            if (f.constraint === 'primary') { props.push('primary_key=True'); hasPk = true; }
            if (f.unique) props.push('unique=True');
            if (f.required === false) props.push('nullable=True');
            else if (f.constraint !== 'primary') props.push('nullable=False');

            modelsCode += `    ${f.name} = db.Column(${colType}${props.length > 0 ? ', ' + props.join(', ') : ''})\n`;
        });

        if (!hasPk) {
            modelsCode += `    id = db.Column(db.Integer, primary_key=True, autoincrement=True)\n`;
        }
        modelsCode += `\n`;

        schemasCode += `class ${table.name}Schema(ma.SQLAlchemyAutoSchema):\n`;
        schemasCode += `    class Meta:\n`;
        schemasCode += `        model = ${table.name}\n`;
        schemasCode += `        load_instance = True\n\n`;
    });

    return { models: modelsCode, schemas: schemasCode };
};

export function generateRouteBlueprint(tableName, endpoints, dbType) {
    let code = `from flask import Blueprint, request, jsonify\n`;
    const bpName = `${tableName.toLowerCase()}_bp`;

    if (dbType === 'mongodb') {
        code += `from app import mongo\nfrom bson.objectid import ObjectId\n\n`;
        code += `${bpName} = Blueprint('${tableName.toLowerCase()}', __name__)\n\n`;
    } else {
        code += `from app import db\nfrom app.models import ${tableName}\nfrom app.schemas import ${tableName}Schema\n\n`;
        code += `${bpName} = Blueprint('${tableName.toLowerCase()}', __name__)\n`;
        code += `${tableName.toLowerCase()}_schema = ${tableName}Schema()\n`;
        code += `${tableName.toLowerCase()}s_schema = ${tableName}Schema(many=True)\n\n`;
    }

    endpoints.forEach(ep => {
        const funcName = ep.route.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_') || 'root';
        const method = ep.method.toUpperCase();
        const routePath = ep.route.startsWith('/') ? ep.route.replace(`/${tableName.toLowerCase()}`, '') : ep.route;
        const finalPath = routePath === '' || routePath === '/' ? '/' : routePath;

        code += `@${bpName}.route('${finalPath}', methods=['${method}'])\n`;
        code += `def ${method.toLowerCase()}_${funcName}():\n`;

        if (method === 'GET') {
            if (dbType === 'mongodb') {
                code += `    collection = mongo.db.${tableName.toLowerCase()}s\n`;
                code += `    results = list(collection.find({}))\n`;
                code += `    for r in results: r['_id'] = str(r['_id'])\n`;
                code += `    return jsonify(results), 200\n\n`;
            } else {
                code += `    results = ${tableName}.query.all()\n`;
                code += `    return jsonify(${tableName.toLowerCase()}s_schema.dump(results)), 200\n\n`;
            }
        } else if (method === 'POST') {
            if (dbType === 'mongodb') {
                code += `    data = request.get_json()\n`;
                code += `    collection = mongo.db.${tableName.toLowerCase()}s\n`;
                code += `    result = collection.insert_one(data)\n`;
                code += `    data['_id'] = str(result.inserted_id)\n`;
                code += `    return jsonify(data), 201\n\n`;
            } else {
                code += `    try:\n`;
                code += `        data = request.get_json()\n`;
                code += `        new_item = ${tableName.toLowerCase()}_schema.load(data, session=db.session)\n`;
                code += `        db.session.add(new_item)\n`;
                code += `        db.session.commit()\n`;
                code += `        return jsonify(${tableName.toLowerCase()}_schema.dump(new_item)), 201\n`;
                code += `    except Exception as e:\n`;
                code += `        return jsonify({"error": str(e)}), 400\n\n`;
            }
        } else {
            code += `    return jsonify({"msg": "${method} endpoint hit"}), 200\n\n`;
        }
    });

    return code;
};

export function generateFlaskProject(zip, data) {
    const { project, dbType, dbConfig, dbName, tables, groupedEndpoints } = data;

    zip.file("requirements.txt", generateRequirementsTxt(dbType, tables));
    zip.file(".env", generateFlaskEnv(8080, dbType, dbConfig, dbName));
    zip.file("run.py", generateRunPy());
    zip.file("README.md", `# ${project.name}\nGenerated Flask Project\n\nRun:\n\`pip install -r requirements.txt\`\n\`python run.py\``);

    const appFolder = zip.folder("app");
    const blueprintNames = Object.keys(groupedEndpoints);

    appFolder.file("__init__.py", generateAppInit(dbType, blueprintNames));

    if (dbType !== 'mongodb') {
        const { models, schemas } = generateModelsAndSchemas(tables, dbType);
        appFolder.file("models.py", models);
        appFolder.file("schemas.py", schemas);
    }

    const routesFolder = appFolder.folder("routes");
    routesFolder.file("__init__.py", "");

    Object.keys(groupedEndpoints).forEach(tableName => {
        const endpoints = groupedEndpoints[tableName];
        routesFolder.file(`${tableName.toLowerCase()}_routes.py`, generateRouteBlueprint(tableName, endpoints, dbType));
    });
};