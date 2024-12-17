import orchestrator from "tests/orchestrator.js";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

const fetchUrl = "http://localhost:3000/api/v1/migrations";
const fetchParams = {
  method: "POST",
};

async function hitMigrationEndPoint() {
  const response = await fetch(fetchUrl, fetchParams);
  const result = await response.json();
  return {
    responseStatus: response.status,
    resultIsArray: Array.isArray(result),
    hasZeroMigrations: result.length === 0,
  };
}

test("/api/v1/migrations", async () => {
  expect(await hitMigrationEndPoint()).toEqual({
    responseStatus: StatusCodes.CREATED,
    resultIsArray: true,
    hasZeroMigrations: false,
  });

  expect(await hitMigrationEndPoint()).toEqual({
    responseStatus: StatusCodes.CREATED,
    resultIsArray: true,
    hasZeroMigrations: true,
  });
});
