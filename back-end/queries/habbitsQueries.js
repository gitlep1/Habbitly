import { db } from "../db/dbConfig.js";

const habitFields = [
  "user_id",
  "habit_name",
  "habit_task_description",
  "habit_task_completed",
  "habit_category",
  "habit_frequency",
  "repetitions_per_frequency",
  "progress_percentage",
  "current_streak",
  "longest_streak",
  "start_date",
  "last_completed_on",
  "end_date",
  "is_active",
  "has_reached_end_date",
  "total_tasks_completed",
  "total_habits_completed",
  "days_of_week_to_complete",
  "day_of_month_to_complete",
  "yearly_month_of_year_to_complete",
  "yearly_day_of_year_to_complete",
];

export const getAllHabbits = async () => {
  const query = "SELECT * FROM habbits";
  const allHabbits = await db.any(query);
  return allHabbits;
};

export const getUserHabbits = async (userId) => {
  const query = `
    SELECT habbits.*, habit_logs.log_date
    FROM habbits
    LEFT JOIN habit_logs ON habbits.id = habit_logs.habit_id
    WHERE habbits.user_id = $1
  `;
  const userHabbits = await db.manyOrNone(query, [userId]);
  return userHabbits;
};

export const getHabbitByID = async (id) => {
  const query = `
    SELECT habbits.*, habit_logs.log_date
    FROM habbits
    LEFT JOIN habit_logs ON habbits.id = habit_logs.habit_id
    WHERE habbits.id = $1
  `;
  const habbit = await db.oneOrNone(query, [id]);

  if (!habbit) {
    return null;
  }

  return habbit;
};

export const createHabbit = async (newHabbitData) => {
  const columns = habitFields.join(", ");
  const placeholders = habitFields
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  const values = habitFields.map((field) => newHabbitData[field]);

  const query = `INSERT INTO habbits (${columns}) VALUES(${placeholders}) RETURNING *`;

  const newHabbit = await db.one(query, values);
  return newHabbit;
};

export const updateHabbit = async (id, updatedHabbitData) => {
  const validFields = habitFields.filter(
    (field) =>
      updatedHabbitData[field] !== undefined &&
      updatedHabbitData[field] !== null
  );

  if (validFields.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = validFields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  const values = validFields.map((field) => updatedHabbitData[field]);

  const query = `UPDATE habbits SET ${setClause} WHERE id = $${
    validFields.length + 1
  } RETURNING *`;

  const updatedHabbit = await db.oneOrNone(query, [...values, id]);
  return updatedHabbit;
};

export const deleteHabbit = async (id) => {
  const query = "DELETE FROM habbits WHERE id = $1 RETURNING *";
  const deletedHabbit = await db.oneOrNone(query, [id]);
  return deletedHabbit;
};
