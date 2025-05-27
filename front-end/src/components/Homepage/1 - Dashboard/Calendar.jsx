import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { Button as MUIButton } from "@mui/material";
import { Calendar as ReactCalendar } from "react-calendar";
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Calendar = () => {
  const authUserString = GetCookies("authUser");
  const userId = authUserString?.id;

  const [activeMonth, setActiveMonth] = useState(new Date());
  const [fetchedHabits, setFetchedHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [habitsForSelectedDateInModal, setHabitsForSelectedDateInModal] =
    useState([]);

  const CheckmarkSVG = () => (
    <svg
      className="calendar-tile-icon checkmark-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
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

  const fetchHabitsForMonth = useCallback(
    async (dateInMonth) => {
      setLoading(true);
      setError(null);

      try {
        const start = startOfMonth(dateInMonth);
        const end = endOfMonth(dateInMonth);

        const daysInMonth = eachDayOfInterval({ start, end });

        const habitsByRelevantDate = new Map();

        for (const day of daysInMonth) {
          const formattedDate = format(day, "yyyy-MM-dd");
          try {
            const tokenData = GetCookies("authToken");
            const response = await axios.get(
              `${API}/habbits/user/${userId}/date/${formattedDate}`,
              {
                withCredentials: true,
                headers: {
                  authorization: `Bearer ${tokenData}`,
                },
              }
            );

            if (response.data.payload) {
              response.data.payload.forEach((habit) => {
                const key = `${habit.id}-${formattedDate}`;
                if (!habitsByRelevantDate.has(key)) {
                  habitsByRelevantDate.set(key, {
                    ...habit,
                    _relevantDate: day,
                  });
                }
              });
            }
          } catch (dayError) {
            console.warn(
              `Could not fetch habits for ${formattedDate}:`,
              dayError
            );
          }
        }
        const finalFetchedHabits = Array.from(habitsByRelevantDate.values());
        setFetchedHabits(finalFetchedHabits);
      } catch (err) {
        console.error("Error fetching habits for month:", err);
        setError("Failed to load habits for the month.");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchHabitsForMonth(activeMonth);
  }, [activeMonth, fetchHabitsForMonth]);

  const isHabitRelevantForDate = useCallback((habit, date) => {
    const relevant = isSameDay(date, habit._relevantDate);
    return relevant;
  }, []);

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const relevantHabits = fetchedHabits.filter((habit) =>
        isHabitRelevantForDate(habit, date)
      );

      if (relevantHabits.length === 0) {
        return null;
      }

      const allCompletedOnDate = relevantHabits.every(
        (habit) =>
          habit.last_completed_on &&
          isSameDay(date, parseISO(habit.last_completed_on))
      );

      if (allCompletedOnDate) {
        return <StarSVG />;
      } else {
        return <CheckmarkSVG />;
      }
    }
    return null;
  };

  const handleDayClicked = (date) => {
    setSelectedDate(date);
    const filteredHabits = fetchedHabits.filter((habit) =>
      isSameDay(date, habit._relevantDate)
    );

    setHabitsForSelectedDateInModal(filteredHabits);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setHabitsForSelectedDateInModal([]);
  };

  const renderHabitTasksInModal = () => {
    if (habitsForSelectedDateInModal.length > 0) {
      return (
        <ul className="modal-habit-list list-unstyled">
          {habitsForSelectedDateInModal.map((habit) => (
            <li key={habit.id} className="modal-habit-item mb-2">
              <h5 className="text-center mb-1">{habit.habit_name}</h5>
              <p className="text-center">{habit.habit_task_description}</p>
              {habit.last_completed_on &&
                isSameDay(selectedDate, parseISO(habit.last_completed_on)) && (
                  <p className="text-success text-center">Completed!</p>
                )}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p className="text-center">No active habits for this day.</p>;
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-card-header">
          <h1>Calendar</h1>
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
