import { Router } from "express";
const news = Router();

import { getAllNews } from "../queries/newsQueries.js";

news.get("/", async (req, res) => {
  try {
    const allNews = await getAllNews();
    // console.log("=== GET all news", allNews, "===");

    if (allNews) {
      res.status(200).json({ payload: allNews });
    } else {
      res.status(404).send("Cannot find any news");
    }
  } catch (error) {
    console.error("ERROR news.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default news;
