import { db } from "../db/dbConfig.js";

export const getHabitHistoryById = async (historyId) => {
  const query = `
    SELECT * FROM habit_history
    WHERE id = $1
  `;
  return await db.oneOrNone(query, [historyId]);
};

export const getHabitHistoryByHabitId = async (habitId) => {
  const query = `
    SELECT * FROM habit_history
    WHERE habit_id = $1
  `;
  return await db.oneOrNone(query, [habitId]);
};

export const getHabitHistoryByUserId = async (userId) => {
  const query = `
    SELECT * FROM habit_history
    WHERE user_id = $1
    ORDER BY timestamp DESC
  `;
  return await db.manyOrNone(query, [userId]);
};

export const addOrUpdateHabitHistoryEntry = async ({
  habit_id,
  user_id,
  habit_name,
  action,
  has_reached_end_date,
}) => {
  const checkQuery = `
    SELECT * FROM habit_history
    WHERE habit_id = $1
    LIMIT 1
  `;
  const existing = await db.oneOrNone(checkQuery, [habit_id]);

  if (existing) {
    const updateQuery = `
      UPDATE habit_history
      SET user_id = $2, habit_name = $3, action = $4, has_reached_end_date = $5, timestamp = NOW()
      WHERE habit_id = $1
      RETURNING *
    `;
    const updateValues = [
      habit_id,
      user_id,
      habit_name,
      action,
      has_reached_end_date,
    ];
    return await db.one(updateQuery, updateValues);
  } else {
    const insertQuery = `
      INSERT INTO habit_history (habit_id, user_id, habit_name, action, has_reached_end_date, timestamp)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const insertValues = [
      habit_id,
      user_id,
      habit_name,
      action,
      has_reached_end_date,
    ];
    return await db.one(insertQuery, insertValues);
  }
};

export const updateHabitHistoryEntry = async ({
  id,
  habit_id,
  user_id,
  habit_name,
  action,
  has_reached_end_date,
}) => {
  const query = `
    UPDATE habit_history
    SET habit_id = $2, user_id = $3, habit_name = $4, action = $5, has_reached_end_date = $6, timestamp = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const values = [
    id,
    habit_id,
    user_id,
    habit_name,
    action,
    has_reached_end_date,
  ];
  return await db.one(query, values);
};

export const deleteHabitHistoryByHabitId = async (habitId) => {
  const query = `
    DELETE FROM habit_history
    WHERE habit_id = $1
    RETURNING *
  `;
  return await db.manyOrNone(query, [habitId]);
};
