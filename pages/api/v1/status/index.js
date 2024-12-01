import database from "../../../../infra/database.js";

export default async function status(request, response) {
  const result = await database.query("select 1+1 as num_total;");
  console.log(result.rows);
  response.status(200).json({ status: 200 });
}
