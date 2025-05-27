import { PropTypes } from "prop-types";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";

import { EditHabit } from "./EditHabit";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ViewHabit = ({ habitData, show, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="view-habit-modal-title">
          {isEditing ? `Editing ${habitData.habit_name}` : habitData.habit_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <EditHabit
            habit={{
              id: habitData.id,
              habit_name: habitData.habit_name,
              habit_task_description: habitData.habit_task_description,
              habit_task_completed: habitData.habit_task_completed,
              habit_category: habitData.habit_category,
              habit_frequency: habitData.habit_frequency,
              repetitions_per_frequency: habitData.repetitions_per_frequency,
              start_date: new Date(habitData.start_date)
                .toISOString()
                .slice(0, 10),
              end_date: habitData.end_date
                ? new Date(habitData.end_date).toISOString().slice(0, 10)
                : "",
              is_active: habitData.is_active,
              has_reached_end_date: habitData.has_reached_end_date,
              days_of_week_to_complete: habitData.days_of_week_to_complete,
              day_of_month_to_complete: habitData.day_of_month_to_complete,
              yearly_month_of_year_to_complete:
                habitData.yearly_month_of_year_to_complete,
              habit_category: habitData.habit_category,
              yearly_day_of_year_to_complete:
                habitData.yearly_day_of_year_to_complete,
            }}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            <p>Task: {habitData.habit_task_description}</p>
            <p>Category: {habitData.habit_category}</p>
            <p>Frequency: {habitData.habit_frequency}</p>
            <p>
              Progress:{" "}
              {habitData.progress_percentage
                ? `${habitData.progress_percentage}%`
                : "No progress yet"}
            </p>
            <p>Times per frequency: {habitData.repetitions_per_frequency}</p>
            <p>Start date: {formatDate(habitData.start_date)}</p>
            <p>
              Last completed on:{" "}
              {habitData.last_completed_on
                ? formatDate(habitData.last_completed_on)
                : "No completions yet"}
            </p>
            <p>
              End date:{" "}
              {habitData.end_date ? formatDate(habitData.end_date) : "Infinite"}
            </p>
            <p>Habit active: {habitData.is_active ? "Active" : "Paused"}</p>
            <p>
              Habit completed:{" "}
              {habitData.has_reached_end_date ? (
                <span
                  style={{ color: "var(--success-color)", fontWeight: "bold" }}
                >
                  Completed! 🎉
                </span>
              ) : (
                "Not yet"
              )}
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="view-habit-footer-buttons">
          {!isEditing && (
            <Button variant="primary" onClick={handleEditClick}>
              Edit
            </Button>
          )}

          {!isEditing && (
            <Button variant="secondary" onClick={onClose}>
              {isEditing ? null : "Close"}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

ViewHabit.propTypes = {
  habitData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    habit_name: PropTypes.string.isRequired,
    habit_task_description: PropTypes.string.isRequired,
    habit_task_completed: PropTypes.bool.isRequired,
    habit_category: PropTypes.string.isRequired,
    habit_frequency: PropTypes.string.isRequired,
    progress_percentage: PropTypes.number,
    repetitions_per_frequency: PropTypes.number.isRequired,
    start_date: PropTypes.string,
    last_completed_on: PropTypes.string,
    end_date: PropTypes.string,
    is_active: PropTypes.bool.isRequired,
    has_reached_end_date: PropTypes.bool.isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
