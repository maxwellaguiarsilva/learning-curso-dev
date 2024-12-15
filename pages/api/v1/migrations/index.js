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
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: `Method "${requestMethod}" not allowed!`,
    });
  }

  let client;
  try {
    client = await database.getNewClient();
    if (!client) {
      throw new Error("Failed to obtain database client.");
    }

    const migrationRunnerParameters = {
      ...defaultMigrationRunner,
      dbClient: client,
      dryRun: requestMethod === "GET",
    };

    const migrations = await migrationRunner(migrationRunnerParameters);

    response
      .status(requestMethod === "POST" ? StatusCodes.CREATED : StatusCodes.OK)
      .json(migrations);
  } catch (error) {
    console.error("Failed to apply migrations:", error);
    throw error;
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (clientEndError) {
        console.error("Error closing database connection:", clientEndError);
      }
    }
  }
}
