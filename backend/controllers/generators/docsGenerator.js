export function generateReadme(project, stack, dbType, tables = [], endpoints = []) {
    let runCommands = "";

    if (stack === 'express') {
        runCommands = `npm install\nnpm run dev`;
    } else if (stack === 'fastapi') {
        runCommands = `pip install -r requirements.txt\nuvicorn main:app --reload`;
    } else if (stack === 'spring' || stack === 'springboot') {
        runCommands = `mvn clean install\nmvn spring-boot:run`;
    } else if (stack === 'django') {
        runCommands = `pip install -r requirements.txt\npython manage.py makemigrations\npython manage.py migrate\npython manage.py runserver`;
    } else if (stack === 'flask') {
        runCommands = `pip install -r requirements.txt\npython run.py`;
    }

    let readme = `# ${project.name}\n\n`;
    readme += `This backend was automatically generated using DragEnd.\n\n`;
    readme += `## Tech Stack\n* Framework: ${stack.toUpperCase()}\n* Database: ${dbType.toUpperCase()}\n\n`;

    readme += `## Getting Started\n\n### Prerequisites\nEnsure you have the required runtime (Node.js, Python, or Java) and the database server running.\n\n`;
    readme += `### Installation and Execution\n\`\`\`bash\n${runCommands}\n\`\`\`\n\n`;

    readme += `## Database Models\n\n`;
    tables.forEach(t => {
        readme += `### ${t.name}\n| Field | Type | Required | Unique |\n|-------|------|----------|--------|\n`;

        const fields = t.fields || [];
        fields.forEach(f => {
            readme += `| ${f.name} | ${f.type} | ${f.required ? 'Yes' : 'No'} | ${f.unique ? 'Yes' : 'No'} |\n`;
        });
        readme += `\n`;
    });

    readme += `## API Endpoints\n\n`;
    readme += `| Method | Route | Description |\n|--------|-------|-------------|\n`;
    endpoints.forEach(ep => {
        readme += `| ${ep.method.toUpperCase()} | \`${ep.route}\` | Operations for ${ep.route.split('/')[1] || 'root'} |\n`;
    });

    readme += `\n\n---\nDocumentation generated automatically.`;
    return readme;
};

export function generateOpenApiJson(project, tables = [], endpoints = []) {
    const openapi = {
        openapi: "3.0.0",
        info: {
            title: project.name,
            description: "Generated API Documentation",
            version: "1.0.0"
        },
        servers: [
            { url: "http://localhost:8080/api", description: "Local server" }
        ],
        paths: {},
        components: {
            schemas: {}
        }
    };

    tables.forEach(table => {
        const properties = {};
        const required = [];

        const fields = table.fields || [];
        fields.forEach(f => {
            let type = "string";
            if (f.type === 'number') type = "number";
            if (f.type === 'boolean') type = "boolean";

            properties[f.name] = { type };
            if (f.required) required.push(f.name);
        });

        openapi.components.schemas[table.name] = {
            type: "object",
            properties,
            ...(required.length > 0 && { required })
        };
    });

    endpoints.forEach(ep => {
        const route = ep.route.startsWith('/') ? ep.route : `/${ep.route}`;
        const method = ep.method.toLowerCase();

        const tableName = tables.find(t => t._id.toString() === ep.connectedTableId?.toString())?.name;

        if (!openapi.paths[route]) openapi.paths[route] = {};

        openapi.paths[route][method] = {
            summary: `${ep.method.toUpperCase()} ${route}`,
            responses: {
                "200": { description: "Successful response" }
            }
        };

        if ((method === 'post' || method === 'put') && tableName) {
            openapi.paths[route][method].requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: `#/components/schemas/${tableName}` }
                    }
                }
            };
        }
    });

    return JSON.stringify(openapi, null, 2);
};

export function generateDocs(zip, data, stack) {
    const { project, dbType, tables = [], endpoints = [] } = data;

    zip.file("README.md", generateReadme(project, stack, dbType, tables, endpoints));
    const docsFolder = zip.folder("docs");
    docsFolder.file("openapi.json", generateOpenApiJson(project, tables, endpoints));
};