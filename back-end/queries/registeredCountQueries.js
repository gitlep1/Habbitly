import { db } from "../db/dbConfig.js";

export const getRegisteredCount = async () => {
  const query = "SELECT * FROM registered_count";
  const registeredCount = await db.oneOrNone(query);
  return registeredCount;
};

export const updateRegisteredCount = async (count, id) => {
  const query =
    "UPDATE registered_count SET count = $1 WHERE id = $2 RETURNING count";
  const updatedCount = await db.oneOrNone(query, [count, id]);
  console.log("=== UPDATE registeredCount", updatedCount, "===");
  return updatedCount;
};
