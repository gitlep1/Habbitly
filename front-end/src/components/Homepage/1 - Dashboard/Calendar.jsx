import { useState, useEffect, useCallback, useContext } from "react";
import { Modal } from "react-bootstrap";
import { Button as MUIButton } from "@mui/material";
import { Calendar as ReactCalendar } from "react-calendar";
import { format, isSameDay, parseISO } from "date-fns";

import { processHabitsForCalendarLogic } from "./calendar-functions/processHabitsForCalendar";

import { habitContext } from "../../../CustomContexts/Contexts";

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
      <circle cx="12" cy="12" r="9" />
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
        console.error("Error fetching all habits:", err);
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
      if (view === "month") {
        const formattedDate = format(date, "yyyy-MM-dd");
        const relevantHabits =
          processedHabitDataByDate.get(formattedDate) || [];

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
        } else if (relevantHabits.length > 0) {
          return <CheckmarkSVG />;
        }
      }
      return null;
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

  const renderHabitTasksInModal = useCallback(() => {
    if (habitsForSelectedDateInModal.length > 0) {
      return (
        <ul className="modal-habit-list list-unstyled">
          {habitsForSelectedDateInModal.map((habit) => (
            <li key={habit.id} className="modal-habit-item mb-2">
              <h5 className="text-center mb-1">{habit.habit_name}</h5>
              <p className="text-center">{habit.habit_task_description}</p>
              {habit.last_completed_on &&
                selectedDate &&
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
  }, [habitsForSelectedDateInModal, selectedDate]);

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
