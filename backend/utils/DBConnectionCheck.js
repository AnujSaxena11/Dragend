import { Pool } from "pg";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";
import sql from "mssql";
import oracledb from "oracledb";

export async function MongoCheck(uri) {
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

export async function OracleCheck(host, port, serviceName, DBUser, DBpassword) {
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

export async function SqlServerCheck(host, port, DatabaseName, DBUser, DBpassword) {
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

export async function PostgresCheck(connectionName, host, port, DBUser, DBpassword, uri) {
  const config = uri ? {
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  } : {
    host: host === "localhost" ? "127.0.0.1" : host,
    port: Number(port),
    user: DBUser,
    password: DBpassword,
    database: connectionName,
    ssl: host === "localhost" ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  };

  console.log(config);

  const pool = new Pool(config);
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

export async function MySqlCheck(connectionName, host, port, DBUser, DBpassword, uri) {
  let connection;
  try {
    const config = uri ? uri : {
      host: host === "localhost" ? "127.0.0.1" : host,
      port: Number(port),
      user: DBUser,
      password: DBpassword,
      database: connectionName,
      connectTimeout: 5000
    };
    connection = await mysql.createConnection(config);
    return { connect: true, status: 200, msg: "MySQL connected successfully" };
  } catch (error) {
    return { connect: false, status: 500, msg: error.message };
  } finally {
    if (connection) await connection.end();
  }
}