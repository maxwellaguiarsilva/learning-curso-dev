test("/api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  const result = await response.json();

  expect(Array.isArray(result)).toEqual(true);
});
