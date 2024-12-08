import database from "infra/database.js";

const queryVersion = "show server_version;";
const queryMaxConnections = "show max_connections;";
const queryOpenedConnections =
  "SELECT count(1)::int as opened_connections FROM pg_stat_activity WHERE datname=current_database()";

async function queryFirstRow(queryObject) {
  return (await database.query(queryObject)).rows.pop();
}

export default async function (request, response) {
  const version = (await queryFirstRow(queryVersion)).server_version;
  const maxConnections = parseInt(
    (await queryFirstRow(queryMaxConnections)).max_connections,
  );
  const openedConnections = (await queryFirstRow(queryOpenedConnections))
    .opened_connections;

  response.status(200).json({
    updated_at: new Date().toISOString(),
    dependences: {
      database: {
        version: version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}
