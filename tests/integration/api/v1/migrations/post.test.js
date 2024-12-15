import cleanDatabase from "./clean-database";
import { StatusCodes } from "http-status-codes";

beforeAll(cleanDatabase);

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
