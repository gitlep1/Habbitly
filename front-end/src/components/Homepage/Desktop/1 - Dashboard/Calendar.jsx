import { useState, useEffect, useContext } from "react";
import { Image, Modal } from "react-bootstrap";
import { Button as MUIButton } from "@mui/material";
import { Calendar as ReactCalendar } from "react-calendar";
import { format, startOfWeek, addDays, isSameDay, isWeekend } from "date-fns";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import { themeContext } from "../../../../CustomContexts/Contexts";

const mockTasks = [
  {
    habit_name: "Meditation",
    habit_task: "Meditate for 10 minutes",
    habit_task_completed: false,
    habit_category: "Mental Health",
    habit_interval: "daily",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-20",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
  {
    habit_name: "Exercise",
    habit_task: "Go for a 30-minute run",
    habit_task_completed: false,
    habit_category: "Physical Health",
    habit_interval: "daily",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-20",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
  {
    habit_name: "Reading",
    habit_task: "Read 20 pages of a book",
    habit_task_completed: false,
    habit_category: "Personal Development",
    habit_interval: "daily",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-18",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
  {
    habit_name: "Journaling",
    habit_task: "Write in my journal for 15 minutes",
    habit_task_completed: false,
    habit_category: "Mental Health",
    habit_interval: "daily",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-18",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
  {
    habit_name: "Learning a new language",
    habit_task: "Practice vocabulary and grammar for 30 minutes using an app",
    habit_task_completed: false,
    habit_category: "Personal Development",
    habit_interval: "daily",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-27",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
  {
    habit_name: "Cooking a new recipe",
    habit_task: "Try cooking a new recipe from a different cuisine for dinner",
    habit_task_completed: false,
    habit_category: "Culinary Skills",
    habit_interval: "weekly",
    habit_progress: 0,
    times_per_interval: 1,
    start_date: "2025-04-27",
    last_completed_date: null,
    end_date: null,
    is_active: true,
    habit_completed: false,
  },
];

export const Calendar = ({}) => {
  const { themeState } = useContext(themeContext);

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
            <p>{habit.habit_task}</p>
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
          {/* <Image
            src={maxwell}
            alt="maxwell-calendar-card"
            id="calendar-cloud"
          /> */}
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
