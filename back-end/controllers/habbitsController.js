import { Router } from "express";
const habbits = Router();

import {
  getAllHabbits,
  getUserHabbits,
  getHabbitByID,
  createHabbit,
  updateHabbit,
  deleteHabbit,
} from "../queries/habbitsQueries.js";

import {
  getHabitHistoryByHabitId,
  addOrUpdateHabitHistoryEntry,
  updateHabitHistoryEntry,
} from "../queries/habitHistoryQueries.js";

import { getUserByID } from "../queries/usersQueries.js";

import { requireAuth } from "../validation/requireAuthv2.js";

habbits.get("/", requireAuth(), async (req, res) => {
  try {
    const allHabbits = await getAllHabbits();
    console.log("=== GET all habbits", allHabbits, "===");

    if (allHabbits) {
      res.status(200).json({ payload: allHabbits });
    } else {
      res.status(404).json({ error: "Cannot find any habbits" });
    }
  } catch (error) {
    console.error("habbits.GET /", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.get("/user", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  try {
    const userHabbits = await getUserHabbits(decodedUserData.id);

    if (userHabbits) {
      res.status(200).json({ payload: userHabbits });
    } else {
      res.status(404).json({ error: "Cannot find any habbits" });
    }
  } catch (error) {
    console.error("habbits.GET /user", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.get("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const checkUser = await getUserByID(decodedUserData.id);
    const getHabbit = await getHabbitByID(id);
    console.log("=== GET habbit by ID", getHabbit, "===");

    if (checkUser.id !== getHabbit.user_id) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED: User does not own this habbit" });
    }

    if (getHabbit) {
      res.status(200).json({ payload: getHabbit });
    } else {
      res.status(404).json({ error: "Habbit not found" });
    }
  } catch (error) {
    console.error("habbits.GET /:id", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.post("/create", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  const newHabbitData = {
    user_id: decodedUserData.id,
    habit_name: req.body.habit_name,
    habit_task_description: req.body.habit_task_description,
    habit_task_completed: req.body.habit_task_completed || false,
    habit_category: req.body.habit_category || null,
    habit_frequency: req.body.habit_frequency,
    repetitions_per_frequency: req.body.repetitions_per_frequency,
    progress_percentage: 0,
    start_date: req.body.start_date,
    last_completed_on: req.body.last_completed_on || null,
    end_date: req.body.end_date || null,
    is_active: req.body.is_active || true,
    has_reached_end_date: req.body.has_reached_end_date || false,
  };

  try {
    const createdHabbit = await createHabbit(newHabbitData);
    console.log("=== POST habbit", createdHabbit, "===");

    if (!createdHabbit) {
      return res.status(404).json({ error: "habit not created" });
    }

    try {
      await addOrUpdateHabitHistoryEntry({
        habit_id: createdHabbit.id,
        user_id: decodedUserData.id,
        habit_name: createdHabbit.habit_name,
        action: "Added",
        has_reached_end_date: createdHabbit.has_reached_end_date,
      });
    } catch (historyError) {
      console.error("Failed to create habit history:", historyError);
      return res.status(200).json({
        payload: createdHabbit,
        warning: "Habit was created, but history tracking failed.",
      });
    }

    return res.status(200).json({ payload: createdHabbit });
  } catch (error) {
    console.error("habbits.POST /create", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.put("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  const updatedHabbitData = {
    habit_name: req.body.habit_name,
    habit_task_description: req.body.habit_task_description,
    habit_task_completed: req.body.habit_task_completed || false,
    habit_category: req.body.habit_category || null,
    habit_frequency: req.body.habit_frequency,
    repetitions_per_frequency: req.body.repetitions_per_frequency,
    progress_percentage: req.body.progress_percentage,
    start_date: req.body.start_date,
    last_completed_on: req.body.last_completed_on || new Date().toISOString(),
    end_date: req.body.end_date || null,
    is_active: req.body.is_active || true,
    has_reached_end_date: req.body.has_reached_end_date || false,
  };

  try {
    const checkUser = await getUserByID(decodedUserData.id);
    const getHabbit = await getHabbitByID(id);

    if (!getHabbit) {
      res.status(404).json({ error: "habbit not found" });
    }

    if (checkUser.id !== getHabbit.user_id) {
      res
        .status(401)
        .json({ error: "UNAUTHORIZED: User does not own this habbit!" });
    }

    const updatedHabbit = await updateHabbit(id, updatedHabbitData);
    console.log("=== PUT habbit", updatedHabbit, "===");

    if (!updatedHabbit) {
      return res.status(404).json({ error: "habit not updated" });
    }

    try {
      const historyEntry = await getHabitHistoryByHabitId(getHabbit.id);

      if (!historyEntry) {
        return res.status(404).json({ error: "Habit history entry not found" });
      }

      await addOrUpdateHabitHistoryEntry({
        habit_id: updatedHabbit.id,
        user_id: decodedUserData.id,
        habit_name: updatedHabbit.habit_name,
        action: "Updated",
        has_reached_end_date: updatedHabbit.has_reached_end_date,
      });
    } catch (historyError) {
      console.error("Failed to update habit history:", historyError);
      return res.status(200).json({
        payload: updatedHabbit,
        warning: "Habit was updated, but history tracking failed.",
      });
    }

    return res.status(200).json({ payload: updatedHabbit });
  } catch (error) {
    console.error("habbits.PUT /:id", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.delete("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const checkUser = await getUserByID(decodedUserData.id);
    const getHabbit = await getHabbitByID(id);

    if (!getHabbit) {
      res.status(404).json({ error: "Habbit not found" });
    }

    if (checkUser.id !== getHabbit.user_id) {
      res
        .status(401)
        .json({ error: "UNAUTHORIZED: User does not own this habbit" });
    }

    const deletedHabbit = await deleteHabbit(id);
    console.log("=== DELETE habbit", deletedHabbit, "===");

    if (!deletedHabbit) {
      return res.status(404).json({ error: "Habbit not deleted" });
    }

    try {
      await addOrUpdateHabitHistoryEntry({
        habit_id: deletedHabbit.id,
        user_id: deletedHabbit.user_id,
        habit_name: deletedHabbit.habit_name,
        action: "Deleted",
        has_reached_end_date: deletedHabbit.has_reached_end_date,
      });
    } catch (historyError) {
      console.error("Habit deleted but history update failed:", historyError);
      return res.status(200).json({
        payload: deletedHabbit,
        warning: "Habbit deleted, but history update failed.",
      });
    }

    return res.status(200).json({ payload: deletedHabbit });
  } catch (error) {
    console.error("habbits.DELETE /:id", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default habbits;
