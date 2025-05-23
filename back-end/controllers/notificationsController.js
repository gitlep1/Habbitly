import { Router } from "express";
import {
  getNotificationSettingsByUserId,
  updateNotificationSettings,
  createNotificationSettings,
} from "../queries/notificationsQueries.js";
import { requireAuth } from "../validation/requireAuthv2.js";

const notifications = Router();

notifications.get("/", requireAuth(), async (req, res) => {
  try {
    const decodedUserData = req.user.decodedUser;
    const userId = decodedUserData.id;

    console.log(`=== GET notifications for user: ${userId} ===`);

    let settings = await getNotificationSettingsByUserId(userId);
    console.log("settings", settings);

    if (!settings) {
      console.log(
        `No notification settings found for user ${userId}. Creating default.`
      );
      settings = await createNotificationSettings(userId);
    }

    res.status(200).json({ payload: settings });
  } catch (error) {
    console.error("ERROR notifications.GET /:", error);
    res.status(500).json({
      error: "Failed to retrieve notification settings. Internal Server Error.",
    });
  }
});

notifications.put("/", requireAuth(), async (req, res) => {
  try {
    const decodedUserData = req.user.decodedUser;
    const userId = decodedUserData.id;
    const {
      email_notifications,
      push_notifications,
      sms_notifications,
      habit_reminders,
      reminder_time,
      celebrate_milestones,
      gentle_nudges,
      nudge_after_days,
      weekly_summary,
    } = req.body;

    if (
      typeof email_notifications !== "boolean" ||
      typeof push_notifications !== "boolean" ||
      typeof sms_notifications !== "boolean" ||
      typeof habit_reminders !== "boolean" ||
      typeof celebrate_milestones !== "boolean" ||
      typeof gentle_nudges !== "boolean" ||
      typeof weekly_summary !== "boolean" ||
      !reminder_time ||
      typeof nudge_after_days !== "number" ||
      nudge_after_days < 1 ||
      nudge_after_days > 7
    ) {
      console.warn(
        `Validation failed for user ${userId}. Received body:`,
        req.body
      );
      return res.status(400).json({
        error:
          "Invalid notification settings data provided. Please check all fields.",
      });
    }

    console.log(`=== PUT update notifications for user: ${userId} ===`);

    const updatedSettings = await updateNotificationSettings(userId, {
      email_notifications,
      push_notifications,
      sms_notifications,
      habit_reminders,
      reminder_time,
      celebrate_milestones,
      gentle_nudges,
      nudge_after_days,
      weekly_summary,
    });

    res.status(200).json({ payload: updatedSettings });
  } catch (error) {
    console.error("ERROR notifications.PUT /:", error);
    res.status(500).json({
      error: "Failed to update notification settings. Internal Server Error.",
    });
  }
});

export default notifications;
