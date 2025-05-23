import { Router } from "express";
const history = Router();

import {
  getHabitHistoryById,
  getHabitHistoryByUserId,
  deleteHabitHistoryByHabitId,
} from "../queries/habitHistoryQueries.js";

import { getUserByID } from "../queries/usersQueries.js";

import { requireAuth } from "../validation/requireAuthv2.js";

history.get("/user", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  try {
    const getAHabitHistory = await getHabitHistoryByUserId(decodedUserData.id);

    if (getAHabitHistory) {
      console.log("=== GET habit history by user ID", getAHabitHistory, "===");

      res.status(200).json({ payload: getAHabitHistory });
    } else {
      res.status(404).send("habit history not found");
    }
  } catch (error) {
    console.error("ERROR history.GET /user/:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

history.get("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const getAUser = await getUserByID(decodedUserData.id);
    if (!getAUser) {
      return res.status(404).send("user not found");
    }

    if (getAUser.id !== decodedUserData.id) {
      return res.status(401).send("Unauthorized");
    }

    const getAHabitHistory = await getHabitHistoryById(id);

    if (getAHabitHistory) {
      console.log("=== GET habit history by ID", getAHabitHistory, "===");

      res.status(200).json({ payload: getAHabitHistory });
    } else {
      res.status(404).send("habit history not found");
    }
  } catch (error) {
    console.error("ERROR history.GET /:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

history.delete("/delete/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const getAUser = await getUserByID(decodedUserData.id);
    if (!getAUser) {
      return res.status(404).send("user not found");
    }

    if (getAUser.id !== decodedUserData.id) {
      return res.status(401).send("Unauthorized");
    }

    const deletedHabitHistory = await deleteHabitHistoryByHabitId(id);

    if (deletedHabitHistory) {
      console.log("=== DELETE habit history", deletedHabitHistory, "===");

      res.status(200).json({ payload: deletedHabitHistory });
    } else {
      res.status(404).send("habit history not found");
    }
  } catch (error) {
    console.error("ERROR history.DELETE /delete/:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default history;
