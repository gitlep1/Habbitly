const { db } = require("../db/dbConfig.js");

const habitFields = [
  "user_id",
  "habit_name",
  "habit_task",
  "habit_task_completed",
  "habit_category",
  "habit_interval",
  "habit_progress",
  "times_per_interval",
  "start_date",
  "last_completed_date",
  "end_date",
  "is_active",
  "habit_completed",
];

const getAllHabbits = async () => {
  const query = "SELECT * FROM habbits";
  const allHabbits = await db.any(query);
  return allHabbits;
};

const getUserHabbits = async (userId) => {
  const query = "SELECT * FROM habbits WHERE user_id = $1";
  const userHabbits = await db.manyOrNone(query, [userId]);
  return userHabbits;
};

const getHabbitByID = async (id) => {
  const query = "SELECT * FROM habbits WHERE id = $1";
  const habbit = await db.oneOrNone(query, [id]);

  if (!habbit) {
    return null;
  }

  return habbit;
};

const createHabbit = async (newHabbitData) => {
  const columns = habitFields.join(", ");
  const placeholders = habitFields
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  const values = habitFields.map((field) => newHabbitData[field]);

  const query = `INSERT INTO habbits (${columns}) VALUES(${placeholders}) RETURNING *`;

  const newHabbit = await db.one(query, values);
  return newHabbit;
};

const updateHabbit = async (id, updatedHabbitData) => {
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

const deleteHabbit = async (id) => {
  const query = "DELETE FROM habbits WHERE id = $1 RETURNING *";
  const deletedHabbit = await db.oneOrNone(query, [id]);
  return deletedHabbit;
};

module.exports = {
  getAllHabbits,
  getUserHabbits,
  getHabbitByID,
  createHabbit,
  updateHabbit,
  deleteHabbit,
};
