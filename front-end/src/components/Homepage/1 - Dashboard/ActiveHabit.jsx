import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";
import { Loading } from "../../../CustomFunctions/Loading/Loading";

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
    habit_task_description,
    habit_task_completed,
    habit_category,
    habit_frequency,
    repetitions_per_frequency,
    progress_percentage,
    start_date,
    last_completed_on,
    end_date,
    is_active,
    has_reached_end_date,
  } = activeHabitData;

  let progressChecker = progress_percentage;

  if (!progressChecker) {
    progressChecker = 0;
  }

  useEffect(() => {
    getActiveHabits();
  }, []);

  const getActiveHabits = async () => {
    const tokenData = GetCookies("authToken");

    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getIntervalLengthInDays = () => {
    const start = new Date(start_date).getTime();
    const end = new Date(end_date).getTime();

    const totalDurationInDays = (end - start) / (1000 * 3600 * 24);

    let intervalLengthInDays = 1;
    if (habit_frequency === "weekly") {
      intervalLengthInDays = 7;
    } else if (habit_frequency === "monthly") {
      intervalLengthInDays = 30;
    } else if (habit_frequency === "yearly") {
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

  const handleCompletion = (habitId) => {
    console.log({ habitId });
    if (has_reached_end_date) return;

    const increment = getProgressIncrement();

    progressChecker += increment;

    if (progressChecker >= 100) {
      progressChecker = 100;
    }

    has_reached_end_date = true;
  };

  const getFlameyGif = () => {
    if (progressChecker >= 75) return flamey4x;
    if (progressChecker >= 50) return flamey3x;
    if (progressChecker >= 25) return flamey2x;
    return flamey1x;
  };

  const renderActiveHabits = () => {
    if (loading) return <Loading message={"Loading Active Habits ..."} />;
    if (error) return <p>Error: {error}</p>;
    if (activeHabitData.length < 1) {
      return (
        <span className="flex justify-self-center">No active habits set</span>
      );
    }
    return activeHabitData.map((habit) => {
      const {
        habit_name,
        habit_task_description,
        habit_task_completed,
        habit_category,
        habit_frequency,
        repetitions_per_frequency,
        progress_percentage,
        start_date,
        last_completed_on,
        end_date,
        is_active,
        has_reached_end_date,
      } = habit;

      let checkProgress = progress_percentage;

      if (!checkProgress) {
        checkProgress = 0;
      }

      return (
        <div key={habit.id} className="active-habit-card-data-container">
          <div className="active-habit-card-data">
            <span>Habit: {habit_name}</span>
            <span>Goal: {habit_task_description}</span>
            <span>Progress: {checkProgress?.toFixed(0)}%</span>
          </div>
          <div className="active-habit-card-checkmark-outer rounded-circle">
            <div
              className="active-habit-card-checkmark-inner"
              onClick={() => {
                handleCompletion(habit);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <span className="flamey-container">
            <Image src={getFlameyGif()} alt="Flamey x1 speed" id="flamey" />
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
        <div className="active-habits-data-container">
          {renderActiveHabits()}
        </div>
      </div>
    </div>
  );
};
