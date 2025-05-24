import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import flamey1x from "../../../assets/images/Dashboard-images/flamey-1x.gif";
import flamey2x from "../../../assets/images/Dashboard-images/flamey-2x.gif";
import flamey3x from "../../../assets/images/Dashboard-images/flamey-3x.gif";
import flamey4x from "../../../assets/images/Dashboard-images/flamey-4x.gif";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ActiveHabit = () => {
  const [activeHabitData, setActiveHabitData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  let progressChecker = habit_progress;

  if (!progressChecker) {
    progressChecker = 0;
  }

  useEffect(() => {
    getActiveHabit();
  }, []);

  const getActiveHabit = async () => {
    const tokenData = GetCookies("authToken");

    await axios
      .get(`${API}/habbits/user`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then((res) => {
        const activeHabit = res.data.payload.filter(
          (habit) => habit.is_active === true
        );
        setActiveHabitData(activeHabit);
      })
      .catch((err) => {
        setError(err);
      });
  };

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

    progressChecker += increment;

    if (progressChecker >= 100) {
      progressChecker = 100;
    }

    habit_completed = true;
  };

  const getFlameyGif = () => {
    if (progressChecker >= 75) return flamey4x;
    if (progressChecker >= 50) return flamey3x;
    if (progressChecker >= 25) return flamey2x;
    return flamey1x;
  };

  const renderActiveHabit = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!activeHabitData) return <p>No active habit</p>;

    return activeHabitData.map((habit) => {
      const {
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
      } = habit;

      let checkProgress = habit_progress;

      if (!checkProgress) {
        checkProgress = 0;
      }

      return (
        <div key={habit.id} className="active-habit-card-data-container">
          <div className="active-habit-card-data">
            <span>Habit: {habit_name}</span>
            <span>Goal: {habit_task}</span>
            <span>Progress: {checkProgress}%</span>
          </div>
          <div className="active-habit-card-checkmark-outer rounded-circle">
            <div className="active-habit-card-checkmark-inner">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="active-habit-container">
      <div className="active-habit-card">
        <div className="active-habit-card-header">
          <h3>
            {activeHabitData.length > 1 ? "Active Habits" : "Active Habit"}
          </h3>
        </div>
        {activeHabitData.length >= 1 ? (
          <div className="active-habits-data-container">
            {activeHabitData.map((habit) => {
              const {
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
              } = habit;

              let checkProgress = habit_progress;

              if (!checkProgress) {
                checkProgress = 0;
              }

              return (
                <div
                  key={habit.id}
                  className="active-habit-card-data-container"
                >
                  <div className="active-habit-card-data">
                    <span>Habit: {habit_name}</span>
                    <span>Goal: {habit_task}</span>
                    <span>Progress: {checkProgress?.toFixed(0)}%</span>
                  </div>
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

                  <span className="flamey-container">
                    <Image
                      src={getFlameyGif()}
                      alt="Flamey x1 speed"
                      id="flamey"
                    />
                    <span className="flamey-progress-bar-container">
                      <div
                        className="flamey-progress-bar"
                        style={{
                          width: `${checkProgress}%`,
                          maxWidth: "100%",
                        }}
                      ></div>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="flex justify-self-center">No active habits set</span>
        )}
      </div>
    </div>
  );
};
