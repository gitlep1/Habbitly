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
    habit_task_description: "",
    habit_category: "",
    habit_frequency: "",
    repetitions_per_frequency: 1,
    start_date: "",
    end_date: "",
    is_active: false,
    has_reached_end_date: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "repetitions_per_frequency") {
      if (value === "") {
        setHabitData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        return;
      }

      const numValue = parseInt(value, 10);
      if (Number.isInteger(numValue) && numValue >= 1) {
        setHabitData((prevData) => ({
          ...prevData,
          [name]: numValue,
        }));
      }
      return;
    }

    setHabitData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !habitData.habit_name ||
      !habitData.habit_task_description ||
      !habitData.habit_frequency ||
      !habitData.repetitions_per_frequency ||
      !habitData.start_date
    ) {
      return toast.error(
        "Please fill out all required fields. Name, description, frequency, Repetitions Per Frequency, Start Date",
        {
          containerId: "toast-notify",
        }
      );
    }

    setHabitData((prevData) => ({
      ...prevData,
      habit_frequency: prevData.habit_frequency.toLowerCase(),
    }));

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
      .catch(() => {
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter habit name"
              name="habit_name"
              value={habitData.habit_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="habitTask">
            <Form.Label className="habit-form-label">Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description (Ex: Do 50 pushups)"
              name="habit_task_description"
              value={habitData.habit_task_description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="habitCategory">
            <Form.Label>Category</Form.Label>
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
            <Form.Label>Frequency</Form.Label>
            <Form.Select
              name="habit_frequency"
              value={habitData.habit_frequency}
              onChange={handleInputChange}
            >
              <option value="">Select Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="repetitionsPerFrequency">
            <Form.Label>Repetitions Per Frequency</Form.Label>
            <Form.Control
              type="number"
              name="repetitions_per_frequency"
              value={habitData.repetitions_per_frequency}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "ArrowUp" &&
                  e.key !== "ArrowDown"
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const paste = (e.clipboardData || window.Clipboard).getData(
                  "text"
                );
                if (!/^\d+$/.test(paste)) {
                  e.preventDefault();
                }
              }}
              min="1"
              step="1"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="ex: 1, 2, 3"
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
                label="Mark as Active?"
                name="is_active"
                checked={habitData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="habitCompleted">
              <Form.Check
                type="checkbox"
                label="Mark as Completed?"
                name="has_reached_end_date"
                checked={habitData.has_reached_end_date}
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
