import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { PropTypes } from "prop-types";

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
    days_of_week_to_complete: [],
    day_of_month_to_complete: null,
    yearly_month_of_year_to_complete: null,
    yearly_day_of_year_to_complete: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "repetitions_per_frequency") {
      if (value === "") {
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

      const numValue = parseInt(value, 10);
      if (Number.isInteger(numValue) && numValue >= 1) {
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: numValue,
        }));
      }
    }

    if (name === "yearly_month_of_year_to_complete") {
      if (value === "") {
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: "",
        }));
      }

      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        const clamped = Math.max(1, Math.min(numValue, 12));
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: clamped,
        }));
      }
    }

    if (
      name === "yearly_day_of_year_to_complete" ||
      name === "day_of_month_to_complete"
    ) {
      if (value === "") {
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: "",
        }));
      }

      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        const clamped = Math.max(1, Math.min(numValue, 31));
        return setHabitData((prevData) => ({
          ...prevData,
          [name]: clamped,
        }));
      }
    }

    if (name === "habit_frequency") {
      return setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
        days_of_week_to_complete: [],
        day_of_month_to_complete: null,
        yearly_month_of_year_to_complete: null,
        yearly_day_of_year_to_complete: null,
      }));
    }

    if (name === "start_date" || name === "end_date") {
      const newDate = value;
      const otherDate =
        name === "start_date" ? habitData.end_date : habitData.start_date;

      if (otherDate) {
        const newDateObj = new Date(newDate);
        const otherDateObj = new Date(otherDate);

        // Prevent same-day selection
        if (newDate === otherDate) {
          return toast.error("Start and End dates cannot be the same.", {
            containerId: "toast-notify",
          });
        }

        // Swap dates if end_date is before start_date
        if (
          (name === "start_date" && newDateObj > otherDateObj) ||
          (name === "end_date" && newDateObj < otherDateObj)
        ) {
          setHabitData((prevData) => ({
            ...prevData,
            start_date: name === "start_date" ? otherDate : newDate,
            end_date: name === "start_date" ? newDate : otherDate,
          }));
          return;
        }
      }
    }

    if (name === "is_active" && checked) {
      setHabitData((prevData) => ({
        ...prevData,
        is_active: true,
        has_reached_end_date: false,
      }));
      return;
    }

    if (name === "has_reached_end_date" && checked) {
      setHabitData((prevData) => ({
        ...prevData,
        has_reached_end_date: true,
        is_active: false,
      }));
      return;
    }

    return setHabitData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayOfWeekChange = (e) => {
    const day = e.target.value;
    setHabitData((prevData) => {
      const currentDays = prevData.days_of_week_to_complete;
      if (e.target.checked) {
        return {
          ...prevData,
          days_of_week_to_complete: [...currentDays, day],
        };
      } else {
        return {
          ...prevData,
          days_of_week_to_complete: currentDays.filter((d) => d !== day),
        };
      }
    });
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

    if (
      habitData.habit_frequency === "Weekly" &&
      habitData.days_of_week_to_complete.length === 0
    ) {
      return toast.error("Please select at least one day for weekly habit.", {
        containerId: "toast-notify",
      });
    }
    if (
      habitData.habit_frequency === "Monthly" &&
      !habitData.day_of_month_to_complete
    ) {
      return toast.error(
        "Please select a day of the month for monthly habit.",
        { containerId: "toast-notify" }
      );
    }
    if (
      habitData.habit_frequency === "Yearly" &&
      (!habitData.yearly_month_of_year_to_complete ||
        !habitData.yearly_day_of_year_to_complete)
    ) {
      return toast.error("Please select a month and day for yearly habit.", {
        containerId: "toast-notify",
      });
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
        <Modal.Title className="add-habit-modal-title">
          Add a Habit <span className="required-legend">* = required</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="habitName">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter habit name"
              name="habit_name"
              value={habitData.habit_name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="habitTask">
            <Form.Label className="habit-form-label">Description *</Form.Label>
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
            <Form.Label>Frequency *</Form.Label>
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

          {/* Conditional rendering for Weekly habits */}
          {habitData.habit_frequency === "Weekly" && (
            <Form.Group controlId="daysOfWeek">
              <Form.Label>Days of Week *</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {["0", "1", "2", "3", "4", "5", "6"].map((dayIndex) => (
                  <Form.Check
                    key={dayIndex}
                    type="checkbox"
                    id={`day-${dayIndex}`}
                    label={
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][parseInt(dayIndex, 10)]
                    }
                    value={dayIndex}
                    checked={habitData.days_of_week_to_complete.includes(
                      dayIndex
                    )}
                    onChange={handleDayOfWeekChange}
                  />
                ))}
              </div>
            </Form.Group>
          )}

          {/* Conditional rendering for Monthly habits */}
          {habitData.habit_frequency === "Monthly" && (
            <Form.Group controlId="dayOfMonth">
              <Form.Label>Day of Month *</Form.Label>
              <Form.Control
                type="number"
                name="day_of_month_to_complete"
                value={habitData.day_of_month_to_complete || ""}
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
                max="31"
                step="1"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="ex: 15 (for the 15th of the month)"
              />
            </Form.Group>
          )}

          {/* Conditional rendering for Yearly habits */}
          {habitData.habit_frequency === "Yearly" && (
            <>
              <Form.Group controlId="yearlyMonth">
                <Form.Label>Month of Year (1–12) *</Form.Label>
                <Form.Control
                  type="number"
                  name="yearly_month_of_year_to_complete"
                  value={habitData.yearly_month_of_year_to_complete || ""}
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
                  max="12"
                  step="1"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="ex: 1 (Jan) or 12 (Dec)"
                />
              </Form.Group>
              <Form.Group controlId="yearlyDay">
                <Form.Label>Day of Month (1–31) *</Form.Label>
                <Form.Control
                  type="number"
                  name="yearly_day_of_year_to_complete"
                  value={habitData.yearly_day_of_year_to_complete || ""}
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
                  max="31"
                  step="1"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="ex: 1, 2, 3"
                />
              </Form.Group>
            </>
          )}

          <Form.Group controlId="repetitionsPerFrequency">
            <Form.Label>Repetitions Per Frequency *</Form.Label>
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
            <Form.Label>Start Date *</Form.Label>
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
                label="Check if active"
                name="is_active"
                checked={habitData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="habitCompleted">
              <Form.Check
                type="checkbox"
                label="Check if completed"
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
              Add Habit
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

AddAHabit.propTypes = {
  onHide: PropTypes.func.isRequired,
  showAddModal: PropTypes.bool.isRequired,
};
