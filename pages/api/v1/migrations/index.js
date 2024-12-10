import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import { StatusCodes } from "http-status-codes";

const defaultMigrationRunner = {
  databaseUrl: process.env.DATABASE_URL,
  dir: join("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
};

export default async function (request, response) {
  const requestMethod = request.method.toUpperCase();
  if (!["GET", "POST"].includes(requestMethod)) {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }

  const migrationRunnerParameters = {
    ...defaultMigrationRunner,
    dryRun: requestMethod === "GET",
  };

  const migrations = await migrationRunner(migrationRunnerParameters);
  response
    .status(
      migrations.length > 0 && requestMethod === "POST"
        ? StatusCodes.CREATED
        : StatusCodes.OK,
    )
    .json(migrations);
}
