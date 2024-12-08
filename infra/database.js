import { Client } from "pg";

function getSSLInfo() {
  if (process.env.DATABASE_SSL_CA)
    return {
      rejectUnauthorized: true,
      ca: process.env.DATABASE_SSL_CA,
      key: process.env.DATABASE_SSL_KEY,
      cert: process.env.DATABASE_SSL_CERT,
    };
  return process.env.DATABASE_USE_SSL ? true : false;
}

const connectionData = {
  connectionString: process.env.DATABASE_URL,
  ssl: getSSLInfo(),
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
