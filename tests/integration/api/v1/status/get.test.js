test("/api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const result = await response.json();

  expect(result).toEqual({
    updated_at: new Date(result.updated_at).toISOString(),
    dependences: {
      database: {
        version: result.dependences.database.version,
        max_connections: parseInt(result.dependences.database.max_connections),
        opened_connections: parseInt(
          result.dependences.database.opened_connections,
        ),
      },
    },
  });
});
