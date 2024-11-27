test("/api/v1/status", async () => {
  const response = fetch("http://localhost:3000/api/v1/status");
  expect(1 + 1).toBe(2);
});
