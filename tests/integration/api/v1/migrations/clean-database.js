import database from "infra/database.js";

export default async function cleanDatabase() {
  await database.query("drop schema public cascade;");
  await database.query("create schema public;");
}
