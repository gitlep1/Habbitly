import { Router } from "express";
const registeredCount = Router();

import { getRegisteredCount } from "../queries/registeredCountQueries.js";

registeredCount.get("/", async (req, res) => {
  try {
    const count = await getRegisteredCount();
    res.status(200).json({ payload: count });
  } catch (error) {
    console.error("ERROR registeredCount.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default registeredCount;
