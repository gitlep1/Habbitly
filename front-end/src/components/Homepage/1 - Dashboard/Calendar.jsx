import { useState, useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import { Button as MUIButton } from "@mui/material";
import { Calendar as ReactCalendar } from "react-calendar";
import { format, startOfWeek, addDays, isSameDay, isWeekend } from "date-fns";
import axios from "axios";

const mockTasks = [
  {
    habit_name: "Meditation",
    habit_task_description: "Meditate for 10 minutes",
    habit_task_completed: false,
    habit_category: "Mental Health",
    habit_frequency: "daily",
    progress_percentage: 0,
    repetitions_per_frequency: 1,
    start_date: "2025-04-20",
    last_completed_on: null,
    end_date: null,
    is_active: true,
    has_reached_end_date: false,
  },
  {
    habit_name: "Exercise",
    habit_task_description: "Go for a 30-minute run",
    habit_task_completed: false,
    habit_category: "Physical Health",
    habit_frequency: "daily",
    progress_percentage: 0,
    repetitions_per_frequency: 1,
    start_date: "2025-04-20",
    last_completed_on: null,
    end_date: null,
    is_active: true,
    has_reached_end_date: false,
  },
  {
    habit_name: "Reading",
    habit_task_description: "Read 20 pages of a book",
    habit_task_completed: false,
    habit_category: "Personal Development",
    habit_frequency: "daily",
    progress_percentage: 0,
    repetitions_per_frequency: 1,
    start_date: "2025-04-18",
    last_completed_on: null,
    end_date: null,
    is_active: true,
    has_reached_end_date: false,
  },
];

export const Calendar = ({}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [habits, setHabits] = useState([]);

  const handleDayClicked = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const renderHabitTasks = () => {
    if (habits.length > 0) {
      return habits.map((habit, index) => {
        return (
          <div key={index} className="calendar-card-modal-tasks">
            <p>{habit.habit_task_description}</p>
          </div>
        );
      });
    } else {
      return <p>No tasks for this day</p>;
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
          onClickDay={(selectedDate) => handleDayClicked(selectedDate)}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDate && `${format(selectedDate, "eeee, MMMM do yyyy")}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Habit tasks:</h3>
          <div className="calendar-card-modal-tasks">
            <p>Task 1</p>
            <p>Task 2</p>
            <p>Task 3</p>
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
