import crypto from "../../utils/crypto.js";

const BASE_PACKAGE = "com.generated.api";
const BASE_PATH = `src/main/java/${BASE_PACKAGE.replace(/\./g, '/')}`;

export function generatePomXml(projectName, dbType, tables) {
    let dependencies = `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
    `;

    if (dbType === 'mongodb') {
        dependencies += `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>`;
    } else {
        dependencies += `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>`;

        if (dbType === 'postgresql') {
            dependencies += `
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>`;
        } else {
            dependencies += `
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>`;
        }
    }

    const needsHashing = tables.some(t => t.fields.some(f => f.isHashed));
    if (needsHashing) {
        dependencies += `
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-crypto</artifactId>
        </dependency>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/> </parent>
    <groupId>com.generated</groupId>
    <artifactId>${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${projectName}</name>
    <description>Generated Spring Boot Project</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
${dependencies}
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`;
};

export function generateApplicationProperties(port, dbType, dbConfig, dbName) {
    let props = `server.port=${port}\n\n`;
    if (!dbConfig) return props + `# DB Config Missing`;

    const creds = dbConfig.credentials || {};
    let password = creds.password;
    try { password = crypto.decrypt(creds.password); } catch (e) { }
    const databaseName = dbName || 'myapp';

    if (dbType === 'mongodb') {
        const uri = dbConfig.uri || `mongodb://${creds.host || 'localhost'}:${creds.port || 27017}/${databaseName}`;
        props += `spring.data.mongodb.uri=${uri}\n`;
        props += `spring.data.mongodb.database=${databaseName}\n`;
    } else {
        const dialect = dbType === 'postgresql' ? 'postgresql' : 'mysql';
        const host = creds.host || 'localhost';
        const portNum = creds.port || (dbType === 'postgresql' ? 5432 : 3306);
        const user = creds.username || 'root';

        props += `spring.datasource.url=jdbc:${dialect}://${host}:${portNum}/${databaseName}\n`;
        props += `spring.datasource.username=${user}\n`;
        props += `spring.datasource.password=${password}\n`;
        props += `spring.jpa.hibernate.ddl-auto=update\n`;
        props += `spring.jpa.show-sql=true\n`;
    }
    return props;
};

export function generateMainClass() {
    return `package ${BASE_PACKAGE};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
`;
};

export function getJavaType(schemaType, isArray) {
    let jType = "String";
    if (schemaType === 'number') jType = "Double";
    if (schemaType === 'boolean') jType = "Boolean";
    if (schemaType === 'date') jType = "java.util.Date";

    return isArray ? `java.util.List<${jType}>` : jType;
};

export function generateModel(table, dbType) {
    let imports = `package ${BASE_PACKAGE}.models;\n\nimport lombok.Data;\nimport lombok.NoArgsConstructor;\nimport lombok.AllArgsConstructor;\n`;
    let annotations = `@Data\n@NoArgsConstructor\n@AllArgsConstructor\n`;
    let fields = '';

    if (dbType === 'mongodb') {
        imports += `import org.springframework.data.annotation.Id;\nimport org.springframework.data.mongodb.core.mapping.Document;\n`;
        annotations += `@Document(collection = "${table.name.toLowerCase()}s")\n`;
        fields += `    @Id\n    private String id;\n\n`;
    } else {
        imports += `import jakarta.persistence.*;\n`;
        annotations += `@Entity\n@Table(name = "${table.name.toLowerCase()}s")\n`;
        fields += `    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n`;
    }

    table.fields.forEach(f => {
        let jType = getJavaType(f.type, f.isArray);
        let columnAnns = [];

        if (dbType !== 'mongodb') {
            if (f.unique) columnAnns.push(`unique = true`);
            if (f.required) columnAnns.push(`nullable = false`);
            if (columnAnns.length > 0) fields += `    @Column(${columnAnns.join(', ')})\n`;
        }

        fields += `    private ${jType} ${f.name};\n\n`;
    });

    return `${imports}\n${annotations}public class ${table.name} {\n${fields}}\n`;
};

export function generateRepository(tableName, dbType) {
    const idType = dbType === 'mongodb' ? 'String' : 'Long';
    const extendsClass = dbType === 'mongodb' ? 'MongoRepository' : 'JpaRepository';

    let code = `package ${BASE_PACKAGE}.repositories;\n\n`;
    code += `import ${BASE_PACKAGE}.models.${tableName};\n`;

    if (dbType === 'mongodb') {
        code += `import org.springframework.data.mongodb.repository.MongoRepository;\n`;
    } else {
        code += `import org.springframework.data.jpa.repository.JpaRepository;\n`;
    }

    code += `import org.springframework.stereotype.Repository;\n\n`;
    code += `@Repository\n`;
    code += `public interface ${tableName}Repository extends ${extendsClass}<${tableName}, ${idType}> {\n}\n`;

    return code;
};

export function generateController(tableName, endpoints) {
    let code = `package ${BASE_PACKAGE}.controllers;\n\n`;
    code += `import ${BASE_PACKAGE}.models.${tableName};\n`;
    code += `import ${BASE_PACKAGE}.repositories.${tableName}Repository;\n`;
    code += `import org.springframework.beans.factory.annotation.Autowired;\n`;
    code += `import org.springframework.http.ResponseEntity;\n`;
    code += `import org.springframework.web.bind.annotation.*;\n\n`;
    code += `import java.util.List;\n\n`;

    code += `@RestController\n`;
    code += `@RequestMapping("/api/${tableName.toLowerCase()}")\n`;
    code += `@CrossOrigin(origins = "*")\n`;
    code += `public class ${tableName}Controller {\n\n`;

    code += `    @Autowired\n`;
    code += `    private ${tableName}Repository repository;\n\n`;

    endpoints.forEach(ep => {
        const method = ep.method.toUpperCase();
        let pathStr = ep.route.startsWith('/') ? ep.route.replace(`/${tableName.toLowerCase()}`, '') : ep.route;
        if (pathStr === '/' || pathStr === '') pathStr = ''; // Base route is handled by class mapping

        const funcName = (method.toLowerCase() + ep.route.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, ''));

        if (method === 'GET') {
            code += `    @GetMapping("${pathStr}")\n`;
            code += `    public List<${tableName}> ${funcName}() {\n`;
            code += `        return repository.findAll();\n    }\n\n`;
        } else if (method === 'POST') {
            code += `    @PostMapping("${pathStr}")\n`;
            code += `    public ${tableName} ${funcName}(@RequestBody ${tableName} data) {\n`;
            code += `        return repository.save(data);\n    }\n\n`;
        } else {
            code += `    @${method.charAt(0) + method.slice(1).toLowerCase()}Mapping("${pathStr}")\n`;
            code += `    public ResponseEntity<?> ${funcName}() {\n`;
            code += `        return ResponseEntity.ok().body("{\"msg\": \"${method} endpoint hit\"}");\n    }\n\n`;
        }
    });

    code += `}\n`;
    return code;
};

export function generateSpringBootProject(zip, data) {
    const { project, dbType, dbConfig, dbName, tables, groupedEndpoints } = data;

    zip.file("pom.xml", generatePomXml(project.name, dbType, tables));
    zip.file("README.md", `# ${project.name}\nGenerated Spring Boot Project\n\nRun with Maven:\n\`mvn spring-boot:run\``);

    const resourcesFolder = zip.folder("src/main/resources");
    resourcesFolder.file("application.properties", generateApplicationProperties(8080, dbType, dbConfig, dbName));

    const baseFolder = zip.folder(BASE_PATH);
    const modelsFolder = baseFolder.folder("models");
    const repositoriesFolder = baseFolder.folder("repositories");
    const controllersFolder = baseFolder.folder("controllers");

    baseFolder.file("Application.java", generateMainClass());

    tables.forEach(table => {
        modelsFolder.file(`${table.name}.java`, generateModel(table, dbType));
        repositoriesFolder.file(`${table.name}Repository.java`, generateRepository(table.name, dbType));
    });

    Object.keys(groupedEndpoints).forEach(tableName => {
        const groupEndpoints = groupedEndpoints[tableName];
        controllersFolder.file(`${tableName}Controller.java`, generateController(tableName, groupEndpoints));
    });
};