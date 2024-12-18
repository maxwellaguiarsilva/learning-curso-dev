import orchestrator from "tests/orchestrator.js";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

const fetchUrl = "http://localhost:3000/api/v1/migrations";
const fetchParams = {
  method: "GET",
};

test("/api/v1/migrations", async () => {
  let count = 0;
  while (++count <= 2) {
    const response = await fetch(fetchUrl, fetchParams);
    const result = await response.json();
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toBeGreaterThan(0);
  }
});
