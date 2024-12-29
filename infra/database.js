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

async function getNewClient() {
  const client = new Client(connectionData);
  await client.connect();
  return client;
}

async function query(queryObject) {
  let client;
  let result;

  try {
    client = await getNewClient();
    if (!client) {
      throw new Error("Failed to obtain database client.");
    }
    result = await client.query(queryObject);
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    try {
      await client?.end();
    } catch (clientEndError) {
      console.error("Error closing database connection:", clientEndError);
    }
  }

  return result;
}

const database = {
  query,
  getNewClient,
};

export default database;
