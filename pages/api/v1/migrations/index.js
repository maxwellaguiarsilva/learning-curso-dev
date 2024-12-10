import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function (request, response) {
  let migrationRunnerParameters = {
    databaseUrl: process.env.DATABASE_URL,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
  };
  switch (request.method.toUpperCase()) {
    case "GET":
      migrationRunnerParameters.dryRun = true;
      break;
    case "POST":
      migrationRunnerParameters.dryRun = false;
      break;
    default:
      return response.status(405).end();
  }

  const migrations = await migrationRunner(migrationRunnerParameters);
  response.status(200).json(migrations);
}
