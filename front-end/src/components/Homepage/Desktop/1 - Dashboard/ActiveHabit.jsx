import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import Luna from "../../../../assets/images/Dashboard-images/Luna.png";
import flamey1x from "../../../../assets/images/Dashboard-images/flamey-1x.gif";
import flamey2x from "../../../../assets/images/Dashboard-images/flamey-2x.gif";
import flamey3x from "../../../../assets/images/Dashboard-images/flamey-3x.gif";
import flamey4x from "../../../../assets/images/Dashboard-images/flamey-4x.gif";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ActiveHabit = () => {
  const [activeHabitData, setActiveHabitData] = useState({});
  const [error, setError] = useState(null);

  const getActiveHabit = async () => {
    const authToken = GetCookies("authToken");

    await axios
      .get(`${API}/habbits`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        const activeHabit = res.data.payload.filter(
          (habit) => habit.is_active === true
        );

        setActiveHabitData(activeHabit[0]);
      })
      .catch((err) => {
        setError(err);
      });
  };

  let {
    habit_name,
    habit_task,
    habit_task_completed,
    habit_category,
    habit_interval,
    habit_progress,
    times_per_interval,
    start_date,
    last_completed_date,
    end_date,
    is_active,
    habit_completed,
  } = activeHabitData;

  const getIntervalLengthInDays = () => {
    const start = new Date(start_date).getTime();
    const end = new Date(end_date).getTime();

    const totalDurationInDays = (end - start) / (1000 * 3600 * 24);

    let intervalLengthInDays = 1;
    if (habit_interval === "weekly") {
      intervalLengthInDays = 7;
    } else if (habit_interval === "monthly") {
      intervalLengthInDays = 30;
    } else if (habit_interval === "yearly") {
      intervalLengthInDays = 365;
    }

    const totalIntervals = Math.floor(
      totalDurationInDays / intervalLengthInDays
    );

    return totalIntervals;
  };

  const getProgressIncrement = () => {
    const totalIntervals = getIntervalLengthInDays();
    return Number((365 / totalIntervals).toFixed(2));
  };

  const handleCompletion = () => {
    if (habit_completed) return;

    const increment = getProgressIncrement();

    habit_progress += increment;

    if (habit_progress >= 100) {
      habit_progress = 100;
    }

    habit_completed = true;
  };

  const getFlameyGif = () => {
    if (habit_progress >= 75) return flamey4x;
    if (habit_progress >= 50) return flamey3x;
    if (habit_progress >= 25) return flamey2x;
    return flamey1x;
  };

  return (
    <div className="active-habit-container">
      <div className="active-habit-card">
        <div className="active-habit-card-header">
          <h3>Active Habit</h3>
          <Image src={Luna} alt="Active Habit Cloud" id="active-habit-cloud" />
        </div>
        <div className="active-habit-card-container">
          <div className="active-habit-card-data">
            {Object.keys(activeHabitData).length === 0 ? (
              <span>No habit has been set as active</span>
            ) : (
              <>
                <span>Habit: {habit_name}</span>
                <span>Goal: {habit_task}</span>
                <span>Progress: {habit_progress.toFixed(0)}%</span>
              </>
            )}
          </div>
          {Object.keys(activeHabitData).length > 0 && (
            <div className="active-habit-card-checkmark-outer rounded-circle">
              <div
                className="active-habit-card-checkmark-inner"
                onClick={handleCompletion}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        {Object.keys(activeHabitData).length > 0 && (
          <span className="flamey-container">
            <Image src={getFlameyGif()} alt="Flamey x1 speed" id="flamey" />
            <span className="flamey-progress-bar-container">
              <div
                className="flamey-progress-bar"
                style={{ width: `${habit_progress}%`, maxWidth: "100%" }}
              ></div>
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
