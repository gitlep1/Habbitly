import { Router } from "express";
const habbits = Router();

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
} from "../queries/habitHistoryQueries.js";

import {
  getUserHabitLogs,
  createHabitLog,
  deleteHabitLog,
} from "../queries/habitLogsQueries.js";

import { getUserByID } from "../queries/usersQueries.js";

import { requireAuth } from "../validation/requireAuthv2.js";

// habbits.get("/", requireAuth(), async (req, res) => {
//   try {
//     const allHabbits = await getAllHabbits();
//     console.log("=== GET all habbits", allHabbits, "===");

//     if (allHabbits) {
//       res.status(200).json({ payload: allHabbits });
//     } else {
//       res.status(404).json({ error: "Cannot find any habbits" });
//     }
//   } catch (error) {
//     console.error("habbits.GET /", { error });
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
    current_streak: 0,
    longest_streak: 0,
    start_date: req.body.start_date,
    last_completed_on: req.body.last_completed_on || null,
    end_date: req.body.end_date || null,
    is_active: req.body.is_active,
    has_reached_end_date: req.body.has_reached_end_date || false,
    days_of_week_to_complete: req.body.days_of_week_to_complete ?? [],
    day_of_month_to_complete: req.body.day_of_month_to_complete ?? null,
    yearly_month_of_year_to_complete:
      req.body.yearly_month_of_year_to_complete ?? null,
    yearly_day_of_year_to_complete:
      req.body.yearly_day_of_year_to_complete ?? null,
  };

  if (!newHabbitData.is_active) {
    newHabbitData.is_active = false;
  }

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
    start_date: req.body.start_date,
    end_date: req.body.end_date || null,
    is_active: req.body.is_active || true,
    has_reached_end_date: req.body.has_reached_end_date || false,
    total_tasks_completed: req.body.total_tasks_completed,
    total_habits_completed: req.body.total_habits_completed,
    days_of_week_to_complete: req.body.days_of_week_to_complete || null,
    day_of_month_to_complete: req.body.day_of_month_to_complete || null,
    yearly_month_of_year_to_complete:
      req.body.yearly_month_of_year_to_complete || null,
    yearly_day_of_year_to_complete:
      req.body.yearly_day_of_year_to_complete || null,
  };

  let previousHabit;
  try {
    previousHabit = await getHabbitByID(id);
    if (!previousHabit) {
      return res.status(404).json({ error: "habit not found" });
    }
  } catch (error) {
    console.error("Error fetching habit for update:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  try {
    const checkUser = await getUserByID(decodedUserData.id);
    if (checkUser.id !== previousHabit.user_id) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED: User does not own this habit!" });
    }
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const wasJustCompletedNow =
    updatedHabbitData.habit_task_completed &&
    !previousHabit.habit_task_completed;

  const today = dayjs().startOf("day");

  if (wasJustCompletedNow) {
    // If the habit was just completed now, update log_date to today
    updatedHabbitData.log_date = today.toISOString();
    // Increment total_tasks_completed when any habit is completed
    updatedHabbitData.total_tasks_completed =
      (previousHabit.total_tasks_completed || 0) + 1;
  } else {
    // If not just completed, retain the previous log_date
    updatedHabbitData.log_date = previousHabit.log_date;
    // Also retain total_tasks_completed if not completed now
    updatedHabbitData.total_tasks_completed =
      previousHabit.total_tasks_completed || 0;
  }

  // === PROGRESS PERCENTAGE CALCULATION === \\
  if (updatedHabbitData.end_date) {
    if (wasJustCompletedNow) {
      const startDate = dayjs(updatedHabbitData.start_date);
      const endDate = dayjs(updatedHabbitData.end_date);
      const currentDate = dayjs();

      const normalizedStartDate = startDate.startOf("day");
      const normalizedEndDate = endDate.startOf("day");
      const normalizedCurrentDate = currentDate.startOf("day");

      if (normalizedCurrentDate.isBefore(normalizedStartDate, "day")) {
        // Habit hasn't started yet
        updatedHabbitData.progress_percentage = 0;
        updatedHabbitData.has_reached_end_date = false;
      } else if (
        normalizedCurrentDate.isSameOrAfter(normalizedEndDate, "day")
      ) {
        // Habit has reached or passed its end date
        updatedHabbitData.progress_percentage = 100;
        updatedHabbitData.has_reached_end_date = true;
        updatedHabbitData.is_active = false;
        updatedHabbitData.total_habits_completed =
          (previousHabit.total_habits_completed || 0) + 1;
      } else {
        const totalDurationDays =
          normalizedEndDate.diff(normalizedStartDate, "day") + 1;
        const daysPassed =
          normalizedCurrentDate.diff(normalizedStartDate, "day") + 1;

        if (totalDurationDays > 0) {
          updatedHabbitData.progress_percentage = Math.min(
            100,
            Math.round((daysPassed / totalDurationDays) * 100)
          );
        } else {
          // start and end date are the same
          updatedHabbitData.progress_percentage = 100;
        }
        updatedHabbitData.has_reached_end_date = false;
      }
    }
  } else {
    updatedHabbitData.progress_percentage = 0;
    updatedHabbitData.has_reached_end_date = false;
  }

  // === STREAK CALCULATION === \\
  let newCurrentStreak = previousHabit.current_streak || 0;
  let newLongestStreak = previousHabit.longest_streak || 0;
  let newMissedPeriodsCount = previousHabit.missed_periods_count || 0;
  let newLastCompletedOn = previousHabit.log_date
    ? dayjs(previousHabit.log_date)
    : null;

  // Match my habit_frequency to what dayjs expects (EX: user puts "Daily" dayjs expects "day")
  const dayjsUnitMap = {
    Daily: "day",
    Weekly: "week",
    Monthly: "month",
    Yearly: "year",
  };

  const dayjsUnit = dayjsUnitMap[updatedHabbitData.habit_frequency];

  // === How streak calculation works === \\

  // 1. Update missed_periods_count before handling current completion
  // Should run when a user views a habit to ensure missed_periods_count is up to date before a completion

  if (newLastCompletedOn) {
    const lastCompletedDay = newLastCompletedOn.startOf("day");
    // Calculate how many "periods" have passed since last completion
    const periodsPassed = today.diff(lastCompletedDay, dayjsUnit);

    // If statement (more than one period has passed) (ex: today is Tue, last completed Mon for daily, then periodsPassed is 1)
    // or if today is not the same period as last completion (ex: today Mon, last Sun for weekly)
    // and the habit was NOT completed "today"
    if (periodsPassed > 0 && !today.isSame(lastCompletedDay, dayjsUnit)) {
      // Only increment missed_periods_count if the habit was NOT completed today,
      // AND the period boundary has passed since last completion.
      // This prevents incrementing misses if the user just completes it in the current period.
      newMissedPeriodsCount = Math.max(
        0,
        newMissedPeriodsCount + periodsPassed - 1
      ); // Only count new full missed periods
    }
  }

  // 2. Handle the current completion
  if (wasJustCompletedNow) {
    // A. Check if the habit was already completed in the "current period"
    // This handles repetitions_per_frequency > 1 or multiple quick completes in a day/week
    let alreadyCompletedInCurrentPeriod = false;
    if (
      newLastCompletedOn &&
      today.isSame(newLastCompletedOn.startOf("day"), dayjsUnit)
    ) {
      // If it was already completed in this period (ex: same day for daily, same week for weekly)
      // and not tracking specific repetitions_per_frequency for streak
      // then don't change streak
      alreadyCompletedInCurrentPeriod = true;
    }

    /** 
      "wasJustCompletedNow" means the user has satisfied the habit's requirement for the current period (ex: once for daily, or repetitions_per_frequency times)
    */

    if (!alreadyCompletedInCurrentPeriod) {
      if (newMissedPeriodsCount >= 7) {
        // User has accumulated 7 misses
        // Streak goes down by 1 for every 7 misses
        const streakDecay = Math.floor(newMissedPeriodsCount / 7);
        newCurrentStreak = Math.max(0, newCurrentStreak - streakDecay);
      }

      // Apply streak catch-up/increment
      if (newMissedPeriodsCount > 0) {
        newCurrentStreak += 2; // Regain 1, add 1
      } else {
        newCurrentStreak += 1; // No misses, regular increment
      }
      newMissedPeriodsCount = 0; // Reset misses on successful completion
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }
    // Update log_date to today if it was just completed otherwise set to previous day
    updatedHabbitData.log_date = today.toISOString();
    updatedHabbitData.total_tasks_completed++;
  } else {
    updatedHabbitData.log_date = previousHabit.log_date;
  }

  // Update the updatedHabbitData with the new streak values
  updatedHabbitData.current_streak = newCurrentStreak;
  updatedHabbitData.longest_streak = newLongestStreak;
  updatedHabbitData.missed_periods_count = newMissedPeriodsCount;

  updatedHabbitData.habit_task_completed = false;

  try {
    const updatedHabbit = await updateHabbit(id, updatedHabbitData);
    // console.log("=== PUT habbit", updatedHabbit, "===");

    if (!updatedHabbit) {
      return res.status(404).json({ error: "habit not updated" });
    }

    try {
      const historyEntry = await getHabitHistoryByHabitId(updatedHabbit.id);

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

    try {
      const habitLogData = {
        habit_id: updatedHabbit.id,
        user_id: decodedUserData.id,
        log_date: dayjs().toISOString(),
      };

      await createHabitLog(habitLogData);
    } catch (logError) {
      console.error("Failed to create habit log:", logError);
      return res.status(200).json({
        payload: updatedHabbit,
        warning: "Habit was updated, but habit log creation failed.",
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
