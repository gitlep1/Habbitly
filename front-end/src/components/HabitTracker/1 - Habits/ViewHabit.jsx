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
        <p>Task: {habitData.habit_task}</p>
        <p>Category: {habitData.habit_category}</p>
        <p>Interval: {habitData.habit_interval}</p>
        <p>
          Progress:{" "}
          {habitData.habit_progress
            ? `${habitData.habit_progress}%`
            : "No progress yet"}
        </p>
        <p>Times per interval: {habitData.times_per_interval}</p>
        <p>Start date: {formatDate(habitData.start_date)}</p>
        <p>
          Last completed date:
          {habitData.last_completed_date
            ? habitData.last_completed_date
            : " Not yet completed"}
        </p>
        <p>End date: {habitData.end_date ? habitData.end_date : "Infinite"}</p>
        <p>Is active: {habitData.is_active ? "Yes" : "No"}</p>
        <p>Habit completed: {habitData.habit_completed ? "Yes" : "No"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
