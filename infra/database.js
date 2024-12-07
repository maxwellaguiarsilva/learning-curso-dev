import { Client } from "pg";

const connectionData = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL_CA
    ? {
        rejectUnauthorized: true,
        ca: process.env.POSTGRES_SSL_CA,
        key: process.env.POSTGRES_SSL_KEY,
        cert: process.env.POSTGRES_SSL_CERT,
      }
    : false,
};

async function query(queryObject) {
  const client = new Client(connectionData);

  await client.connect();
  let result;
  try {
    result = await client.query(queryObject);
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
  }

  return result;
}

export default {
  query: query,
};
