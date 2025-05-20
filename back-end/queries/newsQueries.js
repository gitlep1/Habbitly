import { db } from "../db/dbConfig.js";

export const getAllNews = async () => {
  const query = "SELECT * FROM news";
  const allNews = await db.any(query);
  return allNews;
};
