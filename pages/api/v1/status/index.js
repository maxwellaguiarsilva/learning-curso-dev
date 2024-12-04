import database from "infra/database.js";

const queryVersion = "show server_version;";
const queryMaxConnections = "show max_connections;";

async function queryFirstRow(queryObject) {
  return (await database.query(queryObject)).rows.pop();
}

export default async function status(request, response) {
  const version = (await queryFirstRow(queryVersion)).server_version;
  const max_connections = (await queryFirstRow(queryMaxConnections))
    .max_connections;

  const openedConnections = (
    await queryFirstRow({
      text: "SELECT count(1)::int as num_total FROM pg_stat_activity WHERE datname=$1",
      values: [process.env.POSTGRES_DB],
    })
  ).num_total;

  response.status(200).json({
    updated_at: new Date().toISOString(),
    dependences: {
      database: {
        version: version,
        max_connections: parseInt(max_connections),
        opened_connections: openedConnections,
      },
    },
  });
}
