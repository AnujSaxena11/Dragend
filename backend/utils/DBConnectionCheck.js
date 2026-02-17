const { Pool } = require("pg");
const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");
const sql = require("mssql");
const oracledb = require("oracledb");

async function MongoCheck(uri) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    tlsAllowInvalidCertificates: true
  });

  try {
    await client.connect();
    await client.db().admin().ping();

    return { connect: true, status: 200, msg: "MongoDB connected successfully." };

  } catch (error) {
    return { connect: false, status: 500, msg: error.message };

  } finally {
    await client.close();
  }
}

async function OracleCheck(host, port, serviceName, DBUser, DBpassword) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: DBUser,
      password: DBpassword,
      connectString: `${host}:${port}/${serviceName}`
    });

    await connection.execute("SELECT 1 FROM DUAL");

    return { connect: true, status: 200, msg: "Oracle connected successfully." };

  } catch (error) {
    return { connect: false, status: 500, msg: error.message };

  } finally {
    if (connection) await connection.close();
  }
}

async function SqlServerCheck(host, port, DatabaseName, DBUser, DBpassword) {
  const config = {
    user: DBUser,
    password: DBpassword,
    server: host === "localhost" ? "127.0.0.1" : host,
    port: Number(port),
    database: DatabaseName,
    options: {
      encrypt: host !== "localhost",
      trustServerCertificate: true
    },
    connectionTimeout: 5000
  };

  try {
    const pool = await sql.connect(config);
    await pool.request().query("SELECT 1");

    return { connect: true, status: 200, msg: "SQL Server connected successfully." };

  } catch (error) {
    return { connect: false, status: 500, msg: error.message };

  } finally {
    await sql.close();
  }
}

async function PostgresCheck(connectionName, host, port, DBUser, DBpassword) {
    const pool = new Pool({
        host: host === "localhost" ? "127.0.0.1" : host,
        port: Number(port),
        user: DBUser,
        password: DBpassword,
        database: connectionName,
        ssl: host === "localhost" ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    let client;
    try {
        client = await pool.connect();
        return { connect: true, status: 200, msg: "Postgres Connected successfully." };
    } catch (error) {
        return { connect: false, status: 500, msg: error.message };
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

async function MySqlCheck(connectionName, host, port, DBUser, DBpassword) {
    let connection;
    console.log(connectionName);
    
    try {
        connection = await mysql.createConnection({
            host: host === "localhost" ? "127.0.0.1" : host,
            port: Number(port),
            user: DBUser,
            password: DBpassword,
            database: connectionName,
            connectTimeout: 5000
        });
        return { connect: true, status: 200, msg: "MySQL connected successfully" };

    } catch (error) {
        return { connect: false, status: 500, msg: error.message };

    } finally {
        if (connection) await connection.end();
    }
}
module.exports = {
  PostgresCheck,
  MySqlCheck,
  MongoCheck,
  SqlServerCheck,
  OracleCheck
};
