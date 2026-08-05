import crypto from "../../utils/crypto.js";

export function generateRequirementsTxt(dbType, tables) {
    let reqs = "fastapi==0.103.2\nuvicorn==0.23.2\npython-dotenv==1.0.0\npydantic==2.4.2\n";
    if (dbType === 'mongodb') reqs += "motor==3.3.1\n";
    else if (dbType === 'postgresql') reqs += "sqlalchemy==2.0.21\npsycopg2-binary==2.9.9\nasyncpg==0.28.0\n";
    else reqs += "sqlalchemy==2.0.21\npymysql==1.1.0\naiomysql==0.2.0\n";

    const needsHashing = tables.some(t => t.fields.some(f => f.isHashed));
    if (needsHashing) reqs += "passlib[bcrypt]==1.7.4\n";
    return reqs;
};

export function generateFastApiEnv(port, dbType, dbConfig, dbName) {
    let envContent = `PORT=${port}\n`;
    if (!dbConfig) return envContent + `# DB Config Missing`;

    const creds = dbConfig.credentials || {};
    let password = creds.password;
    try { password = crypto.decrypt(creds.password); } catch (e) { }
    const databaseName = dbName || 'myapp';

    if (dbType === 'mongodb') {
        const uri = dbConfig.uri || `mongodb://${creds.host || 'localhost'}:${creds.port || 27017}/${databaseName}`;
        envContent += `MONGO_URI=${uri}\nDB_NAME=${databaseName}\n`;
    } else {
        const dialect = dbType === 'postgresql' ? 'postgresql+asyncpg' : 'mysql+aiomysql';
        const host = creds.host || 'localhost';
        const portNum = creds.port || (dbType === 'postgresql' ? 5432 : 3306);
        const user = creds.username || 'root';
        const dbUrl = `${dialect}://${user}:${password}@${host}:${portNum}/${databaseName}`;
        envContent += `DATABASE_URL=${dbUrl}\n`;
    }
    return envContent;
};

export function generateFastApiMain() {
    return `import os\nimport uvicorn\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom contextlib import asynccontextmanager\nfrom database import connect_db, disconnect_db\nfrom routers import api_router\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    await connect_db()\n    yield\n    await disconnect_db()\n\napp = FastAPI(lifespan=lifespan, title="Generated API")\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["*"],\n    allow_credentials=True,\n    allow_methods=["*"],\n    allow_headers=["*"],\n)\n\napp.include_router(api_router, prefix="/api")\n\n@app.get("/")\nasync def root():\n    return {"message": "Welcome to Backendless FastAPI"}\n\nif __name__ == "__main__":\n    port = int(os.getenv("PORT", 8080))\n    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)\n`;
};

export function generateFastApiDbConnection(dbType) {
    if (dbType === 'mongodb') {
        return `import os\nfrom motor.motor_asyncio import AsyncIOMotorClient\n\nclient = None\ndb = None\n\nasync def connect_db():\n    global client, db\n    uri = os.getenv("MONGO_URI")\n    db_name = os.getenv("DB_NAME", "myapp")\n    client = AsyncIOMotorClient(uri)\n    db = client[db_name]\n    print("MongoDB Connected Successfully")\n\nasync def disconnect_db():\n    global client\n    if client:\n        client.close()\n\ndef get_db():\n    return db\n`;
    } else {
        return `import os\nfrom sqlalchemy.ext.asyncio import create_async_engine, AsyncSession\nfrom sqlalchemy.orm import sessionmaker, declarative_base\n\nDATABASE_URL = os.getenv("DATABASE_URL")\nengine = create_async_engine(DATABASE_URL, echo=False)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)\nBase = declarative_base()\n\nasync def connect_db():\n    async with engine.begin() as conn:\n        await conn.run_sync(Base.metadata.create_all)\n    print("Database Connected and Tables Synced")\n\nasync def disconnect_db():\n    await engine.dispose()\n\nasync def get_db():\n    async with SessionLocal() as session:\n        yield session\n`;
    }
};

export function generateFastApiModels(table, dbType) {
    if (dbType === 'mongodb') {
        let fields = '';
        table.fields.forEach(f => {
            let pyType = f.type === 'number' ? 'float' : f.type === 'boolean' ? 'bool' : 'str';
            if (f.isArray) pyType = `list[${pyType}]`;
            fields += `    ${f.name}: ${f.required ? pyType : `Optional[${pyType}]`} = ${f.required ? '...' : 'None'}\n`;
        });
        return `from pydantic import BaseModel, Field\nfrom typing import Optional, List\nfrom datetime import datetime\n\nclass ${table.name}Schema(BaseModel):\n${fields || '    pass\n'}\n`;
    } else {
        let fields = ''; let schemas = '';
        table.fields.forEach(f => {
            let saType = f.type === 'number' ? 'Integer' : f.type === 'boolean' ? 'Boolean' : 'String';
            let props = [];
            if (f.constraint === 'primary') props.push('primary_key=True', 'index=True');
            if (f.unique) props.push('unique=True');
            if (f.required === false) props.push('nullable=True');
            fields += `    ${f.name} = Column(${saType}, ${props.join(', ')})\n`;

            let pyType = f.type === 'number' ? 'int' : f.type === 'boolean' ? 'bool' : 'str';
            schemas += `    ${f.name}: ${f.required ? pyType : `Optional[${pyType}]`} = ${f.required ? '...' : 'None'}\n`;
        });

        return `from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime\nfrom database import Base\nfrom pydantic import BaseModel\nfrom typing import Optional\n\n# SQLAlchemy Model\nclass ${table.name}(Base):\n    __tablename__ = "${table.name.toLowerCase()}s"\n${fields || '    id = Column(Integer, primary_key=True, index=True)\n'}\n\n# Pydantic Schema for Validation\nclass ${table.name}Schema(BaseModel):\n${schemas || '    pass\n'}\n    \n    class Config:\n        orm_mode = True\n`;
    }
};

export function generateFastApiRouter(tableName, endpoints, dbType) {
    let code = `from fastapi import APIRouter, Depends, HTTPException\n`;
    if (dbType === 'mongodb') {
        code += `from database import get_db\nfrom models.${tableName} import ${tableName}Schema\nfrom bson import ObjectId\n\n`;
    } else {
        code += `from sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy.future import select\nfrom database import get_db\nfrom models.${tableName} import ${tableName}, ${tableName}Schema\n\n`;
    }
    code += `router = APIRouter()\n\n`;

    endpoints.forEach(ep => {
        const funcName = ep.route.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_') || 'root';
        const routePath = ep.route.startsWith('/') ? ep.route : `/${ep.route}`;
        const method = ep.method.toLowerCase();

        if (dbType === 'mongodb') {
            code += `@router.${method}("${routePath}")\nasync def ${method}_${funcName}(${method === 'post' || method === 'put' ? `data: ${tableName}Schema, ` : ''}db = Depends(get_db)):\n`;
            code += `    collection = db["${tableName.toLowerCase()}s"]\n`;
            if (method === 'get') code += `    cursor = collection.find({})\n    results = await cursor.to_list(length=100)\n    for r in results: r["_id"] = str(r["_id"])\n    return results\n\n`;
            else if (method === 'post') code += `    result = await collection.insert_one(data.dict(exclude_unset=True))\n    return {"id": str(result.inserted_id), **data.dict()}\n\n`;
            else code += `    return {"msg": "${method.toUpperCase()} endpoint hit"}\n\n`;
        } else {
            code += `@router.${method}("${routePath}")\nasync def ${method}_${funcName}(${method === 'post' || method === 'put' ? `data: ${tableName}Schema, ` : ''}db: AsyncSession = Depends(get_db)):\n`;
            if (method === 'get') code += `    result = await db.execute(select(${tableName}))\n    return result.scalars().all()\n\n`;
            else if (method === 'post') code += `    new_item = ${tableName}(**data.dict())\n    db.add(new_item)\n    await db.commit()\n    await db.refresh(new_item)\n    return new_item\n\n`;
            else code += `    return {"msg": "${method.toUpperCase()} endpoint hit"}\n\n`;
        }
    });
    return code;
};

export function generateFastApiProject(zip, data) {
    const { project, dbType, dbConfig, dbName, tables, groupedEndpoints } = data;

    zip.file("requirements.txt", generateRequirementsTxt(dbType, tables));
    zip.file(".env", generateFastApiEnv(8080, dbType, dbConfig, dbName));
    zip.file("main.py", generateFastApiMain());
    zip.file("database.py", generateFastApiDbConnection(dbType));
    zip.file("README.md", `# ${project.name}\nGenerated FastAPI Project\n\nRun:\n\`pip install -r requirements.txt\`\n\`uvicorn main:app --reload\``);

    const modelsFolder = zip.folder("models");
    const routersFolder = zip.folder("routers");

    modelsFolder.file("__init__.py", "");
    routersFolder.file("__init__.py", "");

    let routersInitContent = `from fastapi import APIRouter\n\napi_router = APIRouter()\n\n`;

    tables.forEach(table => {
        modelsFolder.file(`${table.name}.py`, generateFastApiModels(table, dbType));
    });

    Object.keys(groupedEndpoints).forEach(tableName => {
        const groupEndpoints = groupedEndpoints[tableName];

        routersFolder.file(`${tableName}.py`, generateFastApiRouter(tableName, groupEndpoints, dbType));

        routersInitContent += `from .${tableName} import router as ${tableName}_router\n`;
        routersInitContent += `api_router.include_router(${tableName}_router, prefix="/${tableName.toLowerCase()}", tags=["${tableName}"])\n`;
    });

    routersFolder.file("__init__.py", routersInitContent);
};