import { useState, useEffect } from "react";
import { Modal, Image, Button } from "react-bootstrap";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ViewHabit = ({ habitData, show, onClose }) => {
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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="view-habit-modal-title">
          {habitData.habit_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Task: {habitData.habit_task_description}</p>
        <p>Category: {habitData.habit_category}</p>
        <p>Interval: {habitData.habit_frequency}</p>
        <p>
          Progress:{" "}
          {habitData.progress_percentage
            ? `${habitData.progress_percentage}%`
            : "No progress yet"}
        </p>
        <p>Times per interval: {habitData.repetitions_per_frequency}</p>
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
            <span style={{ color: "var(--success-color)", fontWeight: "bold" }}>
              Completed! 🎉
            </span>
          ) : (
            "Not yet"
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
