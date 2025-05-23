import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Modal, Image, Button, Form } from "react-bootstrap";
import axios from "axios";

import { habitContext } from "../../../CustomContexts/Contexts";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const AddAHabit = ({ showAddModal, onHide }) => {
  const { getUserHabits } = useContext(habitContext);

  const [habitData, setHabitData] = useState({
    habit_name: "",
    habit_task: "",
    habit_category: "",
    habit_interval: "",
    habit_progress: 0,
    times_per_interval: 0,
    start_date: "",
    end_date: "",
    is_active: false,
    habit_completed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHabitData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !habitData.habit_name ||
      !habitData.habit_task ||
      !habitData.habit_interval ||
      !habitData.times_per_interval ||
      !habitData.start_date
    ) {
      return toast.error(
        "Please fill out all required fields. Name, Task, Interval, Times Per Interval, Start Date",
        {
          containerId: "toast-notify",
        }
      );
    }

    const tokenData = GetCookies("authToken");

    await axios
      .post(`${API}/habbits/create`, habitData, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then(async () => {
        toast.success("Habit added successfully", {
          containerId: "toast-notify",
        });

        await getUserHabits();

        return setTimeout(() => {
          onHide();
        }, 4100);
      })
      .catch((err) => {
        console.log(err.response);
        return toast.error("Failed to add habit", {
          containerId: "toast-notify",
        });
      });
  };

  return (
    <Modal show={showAddModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Habit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="habitName">
            <Form.Label>Habit Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter habit name"
              name="habit_name"
              value={habitData.habit_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="habitTask">
            <Form.Label>Habit Task</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter habit task (Do 50 pushups), (Read 1 book), (Cook Food)"
              name="habit_task"
              value={habitData.habit_task}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="habitCategory">
            <Form.Label>Habit Category</Form.Label>
            <Form.Select
              name="habit_category"
              value={habitData.habit_category}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              <option value="Creativity">Creativity</option>
              <option value="Emotional Well-being">Emotional Well-being</option>
              <option value="Financial">Financial</option>
              <option value="Learning">Learning</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Physical">Physical</option>
              <option value="Productivity">Productivity</option>
              <option value="Relationships">Relationships</option>
              <option value="Self-Care">Self-Care</option>
              <option value="Spiritual">Spiritual</option>
              <option value="Work/Career">Work/Career</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="habitInterval">
            <Form.Label>Habit Interval</Form.Label>
            <Form.Select
              name="habit_interval"
              value={habitData.habit_interval}
              onChange={handleInputChange}
            >
              <option value="">Select interval</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="habitProgress">
            <Form.Label>Habit Progress</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter habit progress"
              name="habit_progress"
              value={habitData.habit_progress}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="timesPerInterval">
            <Form.Label>Times per Interval</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter times per interval"
              name="times_per_interval"
              value={habitData.times_per_interval}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={habitData.start_date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={habitData.end_date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="flex justify-center gap-8 my-4">
            <Form.Group controlId="isActive">
              <Form.Check
                type="checkbox"
                label="Is Active"
                name="is_active"
                checked={habitData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="habitCompleted">
              <Form.Check
                type="checkbox"
                label="Habit Completed"
                name="habit_completed"
                checked={habitData.habit_completed}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
          <div className="flex justify-center gap-8 my-4">
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
