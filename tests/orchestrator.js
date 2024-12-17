import database from "infra/database.js";
import retry from "async-retry";
import { StatusCodes } from "http-status-codes";

const sqlCleanDatabase = "drop schema public cascade;create schema public;";
const urlFetchStatus = "http://localhost:3000/api/v1/status";
const defaultRetryValues = {
  retries: 100,
  maxTimeout: 1000,
};

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, defaultRetryValues);

    async function fetchStatusPage() {
      const response = await fetch(urlFetchStatus);

      if (response.status !== StatusCodes.OK) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query(sqlCleanDatabase);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
