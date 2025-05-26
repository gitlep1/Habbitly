import { useState, useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";
import { Loading } from "../../../CustomFunctions/Loading/Loading";

import flamey1x from "../../../assets/images/Dashboard-images/flamey-1x.gif";
import flamey2x from "../../../assets/images/Dashboard-images/flamey-2x.gif";
import flamey3x from "../../../assets/images/Dashboard-images/flamey-3x.gif";
import flamey4x from "../../../assets/images/Dashboard-images/flamey-4x.gif";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ActiveHabit = () => {
  const [activeHabits, setActiveHabits] = useState([]);

  const [quickLoading, setQuickLoading] = useState(false);
  const [loading, setLoading] = useState(false);
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
    getActiveHabits();
  }, []);

  const getActiveHabits = async () => {
    const tokenData = GetCookies("authToken");

    setError("");
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
        setActiveHabits(activeHabit);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      .then((res) => {
        setActiveHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === res.data.payload.id ? res.data.payload : habit
          )
        );
      })
      .catch((err) => {
        setError(err?.response?.data?.error);
      })
      .finally(() => {
        setQuickLoading(false);
      });
  };

  const getFlameyGif = (checkProgress) => {
    if (checkProgress >= 75) return flamey4x;
    if (checkProgress >= 50) return flamey3x;
    if (checkProgress >= 25) return flamey2x;
    return flamey1x;
  };

  const renderActiveHabits = () => {
    if (loading) return <Loading message={"Loading Active Habits ..."} />;
    if (error) return <p>Error: {error}</p>;
    if (activeHabits.length < 1) {
      return (
        <span className="flex align-self-center">No active habits set</span>
      );
    }
    return activeHabits.map((habit) => {
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
            {habit_task_completed ? (
              <div
                className="active-habit-card-checkmark-inner habit-completed"
                onClick={() => handleOpenModal(habit)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            ) : (
              <div
                className="active-habit-card-checkmark-inner"
                onClick={() => handleQuickComplete(habit.id)}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <span className="flamey-container">
            <Image
              src={getFlameyGif(checkProgress)}
              alt="Flamey speed"
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
