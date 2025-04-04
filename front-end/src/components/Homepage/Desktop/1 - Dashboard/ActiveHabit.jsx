import { Image } from "react-bootstrap";

import Luna from "../../../../assets/images/Dashboard-images/Luna.png";
import flamey1x from "../../../../assets/images/Dashboard-images/flamey-1x.gif";
import flamey2x from "../../../../assets/images/Dashboard-images/flamey-2x.gif";
import flamey3x from "../../../../assets/images/Dashboard-images/flamey-3x.gif";
import flamey4x from "../../../../assets/images/Dashboard-images/flamey-4x.gif";

export const ActiveHabit = () => {
  const habitMockData = {
    user_id: 1,
    name: "Meditate",
    goal: "Meditate for 10 minutes",
    category: "Mental Health",
    habit_interval: "daily",
    times_per_interval: 1,
    start_date: "2025-01-01",
    goal_completed: false,
    habit_progress: 25,
    last_completed_date: "2025-04-01",
    end_date: "2026-01-01",
    is_active: true,
    habit_completed: false,
  };

  let {
    name,
    goal,
    habit_interval,
    start_date,
    goal_completed,
    habit_progress,
    end_date,
  } = habitMockData;

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
    if (goal_completed) return;

    const increment = getProgressIncrement();

    habit_progress += increment;

    if (habit_progress >= 100) {
      habit_progress = 100;
    }

    goal_completed = true;
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
            <span>Habit: {name}</span>
            <span>Goal: {goal}</span>
            <span>Progress: {habit_progress.toFixed(0)}%</span>
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
        </div>
        <span className="flamey-container">
          <Image src={getFlameyGif()} alt="Flamey x1 speed" id="flamey" />
          <span className="flamey-progress-bar-container">
            <div
              className="flamey-progress-bar"
              style={{ width: `${habit_progress}%`, maxWidth: "100%" }}
            ></div>
          </span>
        </span>
      </div>
    </div>
  );
};
