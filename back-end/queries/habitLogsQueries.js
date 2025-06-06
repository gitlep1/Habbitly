import { db } from "../db/dbConfig.js";

export const getUserHabitLogs = async (userId) => {
  const query = `
    SELECT * FROM habit_logs
    WHERE user_id = $1
  `;
  const habitLogs = await db.manyOrNone(query, [userId]);
  return habitLogs;
};

export const createHabitLog = async (habitLogData) => {
  const query = `
    INSERT INTO habit_logs (habit_id, user_id, log_date)
    VALUES ($1, $2, $3)
    RETURNING *`;

  const values = [
    habitLogData.habit_id,
    habitLogData.user_id,
    habitLogData.log_date,
  ];

  const newHabitLog = await db.one(query, values);
  return newHabitLog;
};

export const deleteHabitLog = async (habitId) => {
  const query = `
    DELETE FROM habit_logs
    WHERE habit_logs.habit_id = $1
    RETURNING *
  `;

  const deletedHabitLogs = await db.manyOrNone(query, [habitId]);
  return deletedHabitLogs;
};
