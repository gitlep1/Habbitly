import "./Notifications.scss";
import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";

const initialNotificationSettings = {
  email: true,
  push: true,
  sms: false,

  habitReminders: true,
  reminderTime: "09:00",

  celebrateMilestones: true,
  gentleNudges: true,
  nudgeAfterDays: 3,
  weeklySummary: true,
};

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Notifications = () => {
  const [settings, setSettings] = useState(initialNotificationSettings);
  const [originalSettings, setOriginalSettings] = useState(
    initialNotificationSettings
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setIsLoading(true);

    const tokenData = GetCookies("authToken");

    await axios
      .get(`${API}/notifications`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then((res) => {
        const backendPayload = res.data.payload;

        const mappedSettings = {
          email: backendPayload.email_notifications,
          push: backendPayload.push_notifications,
          sms: backendPayload.sms_notifications,
          habitReminders: backendPayload.habit_reminders,
          reminderTime: backendPayload.reminder_time
            ? backendPayload.reminder_time.substring(0, 5)
            : "09:00",
          celebrateMilestones: backendPayload.celebrate_milestones,
          gentleNudges: backendPayload.gentle_nudges,
          nudgeAfterDays: backendPayload.nudge_after_days,
          weeklySummary: backendPayload.weekly_summary,
        };

        setSettings(mappedSettings);
        setOriginalSettings(mappedSettings);
      })
      .catch(() => {
        toast.error(
          "Failed to fetch notification settings. Please try again.",
          {
            containerId: "general-toast",
          }
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSettingChange = (e) => {
    const { name, type, checked, value } = e.target;

    let newValue = value;
    if (name === "reminderTime") {
      newValue = value.substring(0, 5);
    } else if (name === "nudgeAfterDays") {
      newValue = parseInt(value, 10);
    } else {
      newValue = type === "checkbox" ? checked : value;
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: newValue,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      email_notifications: settings.email,
      push_notifications: settings.push,
      sms_notifications: settings.sms,
      habit_reminders: settings.habitReminders,
      reminder_time: settings.reminderTime + ":00",
      celebrate_milestones: settings.celebrateMilestones,
      gentle_nudges: settings.gentleNudges,
      nudge_after_days: settings.nudgeAfterDays,
      weekly_summary: settings.weeklySummary,
    };

    const tokenData = GetCookies("authToken");

    await axios
      .put(`${API}/notifications`, dataToSend, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then(() => {
        toast.success("Notification settings saved successfully!", {
          containerId: "notify-success",
        });
        setOriginalSettings(settings);
      })
      .catch((err) => {
        console.log(err?.reponse?.data);
        toast.error("Failed to save notification settings. Please try again.", {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isSaveDisabled =
    isLoading || JSON.stringify(settings) === JSON.stringify(originalSettings);

  return (
    <div className="notifications-container p-4 md:p-8 min-h-screen">
      <Card className="notifications-card mt-[6em] md:mt-0 shadow-xl rounded-2xl">
        <Card.Body>
          <h1 className="notifications-title mb-4">Notification Settings</h1>

          <Form onSubmit={handleSaveSettings}>
            <h3 className="section-subtitle">Delivery Channels</h3>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="emailNotifications"
            >
              <Form.Label column sm="8">
                Email Notifications
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="email-switch"
                  name="email"
                  checked={settings.email}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="pushNotifications">
              <Form.Label column sm="8">
                Push Notifications (Mobile App)
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="push-switch"
                  name="push"
                  checked={settings.push}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="smsNotifications">
              <Form.Label column sm="8">
                SMS Notifications (Text Messages)
                <br />
                <small className="text-muted text-sm">
                  Carrier rates may apply. Not available in all regions.
                </small>
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="sms-switch"
                  name="sms"
                  checked={settings.sms}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            <hr className="my-4" />

            <h3 className="section-subtitle">Habit Reminders</h3>
            <Form.Group as={Row} className="mb-3" controlId="habitReminders">
              <Form.Label column sm="8">
                Remind me to check in on my habits
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="habit-reminders-switch"
                  name="habitReminders"
                  checked={settings.habitReminders}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            {settings.habitReminders && (
              <Form.Group as={Row} className="mb-3" controlId="reminderTime">
                <Form.Label column sm="8">
                  Preferred Check-in Time
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="time"
                    name="reminderTime"
                    value={settings.reminderTime}
                    onChange={handleSettingChange}
                    className="notifications-input"
                  />
                </Col>
              </Form.Group>
            )}

            <hr className="my-4" />

            <h3 className="section-subtitle">Progress & Encouragement</h3>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="celebrateMilestones"
            >
              <Form.Label column sm="8">
                Celebrate new milestones and achievements
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="celebrate-milestones-switch"
                  name="celebrateMilestones"
                  checked={settings.celebrateMilestones}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="gentleNudges">
              <Form.Label column sm="8">
                Send gentle nudges if I&apos;ve been away from a habit
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="gentle-nudges-switch"
                  name="gentleNudges"
                  checked={settings.gentleNudges}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            {settings.gentleNudges && (
              <Form.Group as={Row} className="mb-3" controlId="nudgeAfterDays">
                <Form.Label column sm="8">
                  Nudge after how many days of inactivity?
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="number"
                    name="nudgeAfterDays"
                    value={settings.nudgeAfterDays}
                    onChange={handleSettingChange}
                    min="1"
                    max="7"
                    className="notifications-input"
                  />
                </Col>
              </Form.Group>
            )}

            <Form.Group as={Row} className="mb-3" controlId="weeklySummary">
              <Form.Label column sm="8">
                Send a weekly progress summary
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="weekly-summary-switch"
                  name="weeklySummary"
                  checked={settings.weeklySummary}
                  onChange={handleSettingChange}
                />
              </Col>
            </Form.Group>

            <div className="text-center pt-4">
              <Button
                variant="primary"
                type="submit"
                className="px-6"
                disabled={isSaveDisabled}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
