import { useState, useEffect, useContext } from "react";
import { Image, Modal } from "react-bootstrap";
import { isSameDay, isSameWeek, isSameMonth, isSameYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";
import { Loading } from "../../../CustomFunctions/Loading/Loading";
import { habitContext } from "../../../CustomContexts/Contexts";

import flamey1x from "../../../assets/images/Dashboard-images/flamey-1x.gif";
import flamey2x from "../../../assets/images/Dashboard-images/flamey-2x.gif";
import flamey3x from "../../../assets/images/Dashboard-images/flamey-3x.gif";
import flamey4x from "../../../assets/images/Dashboard-images/flamey-4x.gif";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ActiveHabit = () => {
  const navigate = useNavigate();

  const { userHabits, getUserHabits } = useContext(habitContext);
  const activeHabits = userHabits.filter((habit) => habit.is_active === true);

  const [quickLoading, setQuickLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const handleOpenModal = (habit) => {
    setSelectedHabit(habit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHabit(null);
  };

  useEffect(() => {
    const fetchInitialHabits = async () => {
      await getUserHabits();
      setInitialLoad(false);
    };
    if (userHabits.length === 0 && initialLoad) {
      fetchInitialHabits();
    } else if (userHabits.length > 0) {
      setInitialLoad(false);
    }
  }, [getUserHabits, userHabits, initialLoad]);

  const handleQuickComplete = async (habitId) => {
    const authToken = GetCookies("authToken");

    const activeHabitData = activeHabits.find((habit) => habit.id === habitId);

    const updatedHabitData = {
      ...activeHabitData,
      habit_task_completed: true,
    };

    setError("");
    setQuickLoading(true);

    await axios
      .put(`${API}/habbits/${habitId}`, updatedHabitData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(async (res) => {
        await getUserHabits();
      })
      .catch((err) => {
        setError(err?.response?.data?.error);
      })
      .finally(() => {
        setQuickLoading(false);
      });
  };

  const getFlameyGif = (checkProgress, hasEndDate) => {
    if (hasEndDate) {
      if (checkProgress >= 75) return flamey4x;
      if (checkProgress >= 50) return flamey3x;
      if (checkProgress >= 25) return flamey2x;
      return flamey1x;
    } else {
      if (checkProgress >= 50) return flamey4x;
      if (checkProgress >= 25) return flamey3x;
      if (checkProgress >= 10) return flamey2x;
      return flamey1x;
    }
  };

  const isHabitCompleted = (habit, now = new Date()) => {
    const lastCompleted = habit.log_date ? new Date(habit.log_date) : null;

    if (!lastCompleted) return false;

    switch (habit.habit_frequency) {
      case "Daily":
        return isSameDay(now, lastCompleted);

      case "Weekly":
        return isSameWeek(now, lastCompleted, { weekStartsOn: 1 });

      case "Monthly":
        return isSameMonth(now, lastCompleted);

      case "Yearly":
        return isSameYear(now, lastCompleted);

      default:
        return false;
    }
  };

  const renderActiveHabits = () => {
    if (initialLoad) return <Loading message={"Loading Active Habits ..."} />;
    if (error) return <p>Error: {error}</p>;
    if (activeHabits.length < 1) {
      return (
        <p className="flex align-self-center gap-2">
          No active habits
          <span
            className="text-green-400 underline cursor-pointer hover:text-green-300"
            onClick={() => {
              navigate("/habit-tracker");
            }}
          >
            add a habit here
          </span>
        </p>
      );
    }
    return activeHabits.map((habit) => {
      const {
        habit_name,
        habit_task_description,
        progress_percentage,
        end_date,
        current_streak,
        longest_streak,
      } = habit;

      const isCompleted = isHabitCompleted(habit);

      const hasEndDate = !!end_date;

      let checkProgress = progress_percentage;
      if (typeof checkProgress !== "number") {
        checkProgress = 0;
      }

      return (
        <div key={habit.id} className="active-habit-card-data-container">
          <div className="active-habit-card-data">
            <span>Habit: {habit_name}</span>
            <span>Goal: {habit_task_description}</span>
            {hasEndDate && <span>Progress: {checkProgress?.toFixed(0)}%</span>}
          </div>

          <div className="active-habit-card-icon-outer rounded-circle">
            {isCompleted ? (
              <div
                className="active-habit-card-icon-inner habit-completed"
                onClick={() => handleOpenModal(habit)}
              >
                {quickLoading ? (
                  <Loading message={""} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                )}
              </div>
            ) : (
              <div
                className="active-habit-card-icon-inner"
                onClick={() => handleQuickComplete(habit.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <span className="flamey-container">
            <Image
              src={
                hasEndDate
                  ? getFlameyGif(checkProgress, true)
                  : getFlameyGif(checkProgress, false)
              }
              alt="Flamey speed"
              id="flamey"
            />
            {hasEndDate ? (
              <span className="flamey-progress-bar-container">
                <div
                  className="flamey-progress-bar"
                  style={{
                    width: `${checkProgress}%`,
                    maxWidth: "100%",
                  }}
                ></div>
              </span>
            ) : (
              <div className="flex flex-col items-center text-sm font-semibold ml-2 gap-1">
                <span className="text-gray-100">
                  Current Streak:{" "}
                  <span className="text-orange-300">{current_streak || 0}</span>
                </span>
                <span className="text-gray-100">
                  Longest Streak:{" "}
                  <span className="text-blue-300">{longest_streak || 0}</span>
                </span>
              </div>
            )}
          </span>
        </div>
      );
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getDaySuffix(day)}, ${year}`;
  };

  return (
    <div className="active-habit-container">
      <div className="active-habit-card">
        <div className="active-habit-card-header">
          <h3>{activeHabits.length > 1 ? "Active Habits" : "Active Habit"}</h3>
        </div>
        <div className="active-habits-data-container">
          {renderActiveHabits()}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="active-habit-modal-title">
            {selectedHabit?.habit_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>ID:</strong> {selectedHabit?.id.slice(0, 6)}
          </p>
          <p>
            <strong>Task:</strong> {selectedHabit?.habit_task_description}
          </p>
          <p>
            <strong>Last Completed on:</strong>{" "}
            {formatDate(selectedHabit?.last_completed_on)}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};
