const { db } = require("../db/dbConfig.js");

const getAllNews = async () => {
  const query = "SELECT * FROM news";
  const allNews = await db.any(query);
  return allNews;
};

module.exports = {
  getAllNews,
};
