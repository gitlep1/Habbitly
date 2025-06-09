import { useState, useEffect, useCallback, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { Button as MUIButton } from "@mui/material";
import { Calendar as ReactCalendar } from "react-calendar";
import {
  format,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { toast } from "react-toastify";

import { processHabitsForCalendarLogic } from "./calendar-functions/processHabitsForCalendar";

import { habitContext } from "../../../CustomContexts/Contexts";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";
import axios from "axios";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Calendar = () => {
  const { userHabits, getUserHabits } = useContext(habitContext);

  const [activeMonth, setActiveMonth] = useState(new Date());
  const [processedHabitDataByDate, setProcessedHabitDataByDate] = useState(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [habitsForSelectedDateInModal, setHabitsForSelectedDateInModal] =
    useState([]);

  const KebabMenuSVG = () => (
    <svg
      className="calendar-tile-icon kebab-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="19" r="2" />
    </svg>
  );

  const StarSVG = () => (
    <svg
      className="calendar-tile-icon star-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );

  useEffect(() => {
    const fetchAllHabits = async () => {
      setLoading(true);
      setError(null);
      try {
        await getUserHabits();
      } catch (err) {
        setError("Failed to load all habits.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllHabits();
  }, [getUserHabits]);

  const processHabitsForCalendar = useCallback(() => {
    processHabitsForCalendarLogic(
      userHabits,
      activeMonth,
      setProcessedHabitDataByDate
    );
  }, [userHabits, activeMonth, setProcessedHabitDataByDate]);

  useEffect(() => {
    processHabitsForCalendar();
  }, [userHabits, activeMonth, processHabitsForCalendar]);

  const getTileContent = useCallback(
    ({ date, view }) => {
      if (!view === "month") return;

      const formattedDate = format(date, "yyyy-MM-dd");
      const relevantHabits = processedHabitDataByDate.get(formattedDate) || [];

      if (relevantHabits.length === 0) return null;

      const allCompletedOnDate = relevantHabits.every((habit) =>
        habit?.log_dates.some((logDate) => isSameDay(date, parseISO(logDate)))
      );

      if (allCompletedOnDate) {
        return <StarSVG />;
      }

      return <KebabMenuSVG />;
    },
    [processedHabitDataByDate]
  );

  const handleDayClicked = useCallback(
    (date) => {
      setSelectedDate(date);
      const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
      const filteredHabits = formattedDate
        ? processedHabitDataByDate.get(formattedDate) || []
        : [];

      setHabitsForSelectedDateInModal(filteredHabits);
      setShowModal(true);
    },
    [processedHabitDataByDate]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedDate(null);
    setHabitsForSelectedDateInModal([]);
  }, []);

  const handleQuickComplete = async (habitId) => {
    const authToen = GetCookies("authToken");
    const habitToUpdate = userHabits.find((habit) => habit.id === habitId);

    const today = startOfDay(new Date());
    const clickedDate = startOfDay(selectedDate);

    if (isAfter(clickedDate, today)) {
      return toast.info("You can't mark future dates as complete.", {
        containerId: "toast-notify",
      });
    }

    const clickedDateISO = clickedDate.toISOString();

    const dataToSend = {
      ...habitToUpdate,
      last_completed_on: clickedDateISO,
    };

    await axios
      .put(`${API}/habbits/${habitId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${authToen}`,
        },
      })
      .then(async (res) => {
        await getUserHabits();
      })
      .catch((err) => {
        return toast.error("Failed to update habit completion.", {
          containerId: "toast-notify",
        });
      });
  };

  const renderHabitTasksInModal = useCallback(() => {
    if (habitsForSelectedDateInModal.length > 0) {
      return (
        <ul className="modal-habit-list list-unstyled">
          {habitsForSelectedDateInModal.map((habit) => {
            const completedOnSelectedDate = habit?.log_dates?.some(
              (logDate) => {
                return isSameDay(selectedDate, parseISO(logDate));
              }
            );

            return (
              <li key={habit.id} className="modal-habit-item mb-2">
                <h5 className="text-center mb-1">{habit.habit_name}</h5>
                <p className="text-center">{habit.habit_task_description}</p>
                <Button
                  variant="dark"
                  onClick={() => {
                    handleQuickComplete(habit.id);
                  }}
                >
                  Complete
                </Button>
                {completedOnSelectedDate && (
                  <p className="text-success text-center">Completed!</p>
                )}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <p className="text-center">No active habits for this day.</p>;
    }
  }, [habitsForSelectedDateInModal, selectedDate]); // eslint-disable-line

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-card-header">
          <span className="calendar-header-icon">
            <StarSVG /> <p className="text-sm">Tasks completed</p>
          </span>
          <h1>Calendar</h1>
          <span className="calendar-header-icon">
            <KebabMenuSVG /> <p className="text-sm">Tasks remaining</p>
          </span>
        </div>

        <ReactCalendar
          className="calendar-content"
          onClickDay={handleDayClicked}
          tileContent={getTileContent}
          onActiveStartDateChange={({ activeStartDate }) => {
            setActiveMonth(activeStartDate);
          }}
          value={selectedDate}
        />

        {loading && (
          <p className="text-center">
            Loading tasks for {format(activeMonth, "MMMM yyyy")}
          </p>
        )}
        {error && <p className="text-center text-danger">{error}</p>}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            {selectedDate && `${format(selectedDate, "eeee, MMMM do, yyyy")}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="calendar-card-modal-tasks">
            {renderHabitTasksInModal()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <MUIButton
            variant="outlined"
            color="primary"
            onClick={handleCloseModal}
          >
            Close
          </MUIButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
