import { useState, useEffect } from "react";
import { Modal, Image, Button } from "react-bootstrap";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ViewHabit = ({ habitData, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{habitData.habit_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{habitData.habit_task}</p>
        <p>Category: {habitData.habit_category}</p>
        <p>Interval: {habitData.habit_interval}</p>
        <p>Progress: {habitData.habit_progress}%</p>
        <p>Times per interval: {habitData.times_per_interval}</p>
        <p>Start date: {habitData.start_date}</p>
        <p>Last completed date: {habitData.last_completed_date}</p>
        <p>End date: {habitData.end_date}</p>
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
