import migrationRunner from "node-pg-migrate";
import { join, resolve } from "node:path";
import { StatusCodes } from "http-status-codes";
import database from "infra/database";

const defaultMigrationRunner = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
};

export default async function (request, response) {
  const requestMethod = request.method.toUpperCase();
  if (!["GET", "POST"].includes(requestMethod)) {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }

  const client = await database.getNewClient();
  const migrationRunnerParameters = {
    ...defaultMigrationRunner,
    dbClient: client,
    dryRun: requestMethod === "GET",
  };

  const migrations = await migrationRunner(migrationRunnerParameters);
  await client.end();
  response
    .status(
      migrations.length > 0 && requestMethod === "POST"
        ? StatusCodes.CREATED
        : StatusCodes.OK,
    )
    .json(migrations);
}
