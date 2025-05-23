import { db } from "../db/dbConfig.js";

export const getNotificationSettingsByUserId = async (userId) => {
  const query = "SELECT * FROM notifications WHERE user_id = $1";
  const settings = await db.oneOrNone(query, userId);
  return settings;
};

export const createNotificationSettings = async (userId) => {
  const query = `
    INSERT INTO notifications (
      user_id,
      email_notifications,
      push_notifications,
      sms_notifications,
      habit_reminders,
      reminder_time,
      celebrate_milestones,
      gentle_nudges,
      nudge_after_days,
      weekly_summary
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING *;
  `;
  const newSettings = await db.one(query, [
    userId,
    true,
    true,
    false,
    true,
    "09:00:00",
    true,
    true,
    3,
    true,
  ]);
  return newSettings;
};

export const updateNotificationSettings = async (userId, settings) => {
  const query = `
    UPDATE notifications SET
      email_notifications = $2,
      push_notifications = $3,
      sms_notifications = $4,
      habit_reminders = $5,
      reminder_time = $6,
      celebrate_milestones = $7,
      gentle_nudges = $8,
      nudge_after_days = $9,
      weekly_summary = $10
    WHERE user_id = $1
    RETURNING *;
  `;
  const updatedSettings = await db.one(query, [
    userId,
    settings.email_notifications,
    settings.push_notifications,
    settings.sms_notifications,
    settings.habit_reminders,
    settings.reminder_time,
    settings.celebrate_milestones,
    settings.gentle_nudges,
    settings.nudge_after_days,
    settings.weekly_summary,
  ]);
  return updatedSettings;
};
