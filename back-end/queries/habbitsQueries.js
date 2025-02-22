const { db } = require("../db/dbConfig.js");

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
  const query =
    "INSERT INTO habbits (user_id, name, goal, category, interval, times_per_interval, start_date, last_completed_date, streak, end_date, is_active, completed) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";

  const newHabbit = await db.one(query, [
    newHabbitData.user_id,
    newHabbitData.name,
    newHabbitData.goal,
    newHabbitData.category,
    newHabbitData.interval,
    newHabbitData.times_per_interval,
    newHabbitData.start_date,
    newHabbitData.last_completed_date,
    newHabbitData.streak,
    newHabbitData.end_date,
    newHabbitData.is_active,
    newHabbitData.completed,
  ]);

  return newHabbit;
};

const updateHabbit = async (id, updatedHabbitData) => {
  const query =
    "UPDATE habbits SET name = $1, goal = $2, category = $3, interval = $4, times_per_interval = $5, start_date = $6, last_completed_date = $7, streak = $8, end_date = $9, is_active = $10, completed = $11 WHERE id = $12 RETURNING *";

  const updatedHabbit = await db.oneOrNone(query, [
    updatedHabbitData.name,
    updatedHabbitData.goal,
    updatedHabbitData.category,
    updatedHabbitData.interval,
    updatedHabbitData.times_per_interval,
    updatedHabbitData.start_date,
    updatedHabbitData.last_completed_date,
    updatedHabbitData.streak,
    updatedHabbitData.end_date,
    updatedHabbitData.is_active,
    updatedHabbitData.completed,
    id,
  ]);

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
