import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { PropTypes } from "prop-types";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import { habitContext } from "../../../CustomContexts/Contexts";

import { Loading } from "../../../CustomFunctions/Loading/Loading";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const EditHabit = ({ habit, onCancel }) => {
  const { getUserHabits } = useContext(habitContext);

  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    habit_name: habit.habit_name,
    habit_task_description: habit.habit_task_description,
    habit_task_completed: habit.habit_task_completed,
    habit_category: habit.habit_category,
    habit_frequency: habit.habit_frequency,
    repetitions_per_frequency: habit.repetitions_per_frequency,
    start_date: habit.start_date,
    end_date: habit.end_date,
    is_active: habit.is_active,
    days_of_week_to_complete: habit.days_of_week_to_complete,
    day_of_month_to_complete: habit.day_of_month_to_complete,
    yearly_month_of_year_to_complete: habit.yearly_month_of_year_to_complete,
    yearly_day_of_year_to_complete: habit.yearly_day_of_year_to_complete,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "repetitions_per_frequency") {
      if (value === "") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        return;
      }

      const numValue = parseInt(value, 10);
      if (Number.isInteger(numValue) && numValue >= 1) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: numValue,
        }));
      }
      return;
    }

    if (name === "yearly_month_of_year_to_complete") {
      if (value === "") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: "",
        }));
        return;
      }

      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        const clamped = Math.max(1, Math.min(numValue, 12));
        setFormData((prevData) => ({
          ...prevData,
          [name]: clamped,
        }));
      }
      return;
    }

    if (
      name === "yearly_day_of_year_to_complete" ||
      name === "day_of_month_to_complete"
    ) {
      if (value === "") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: "",
        }));
        return;
      }

      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        const clamped = Math.max(1, Math.min(numValue, 31));
        setFormData((prevData) => ({
          ...prevData,
          [name]: clamped,
        }));
      }
      return;
    }

    if (name === "habit_frequency") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        days_of_week_to_complete: [],
        day_of_month_to_complete: null,
        yearly_month_of_year_to_complete: null,
        yearly_day_of_year_to_complete: null,
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayOfWeekChange = (e) => {
    const day = e.target.value;
    setFormData((prevData) => {
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
      !formData.habit_name ||
      !formData.habit_task_description ||
      !formData.habit_frequency ||
      !formData.repetitions_per_frequency ||
      !formData.start_date
    ) {
      return toast.error(
        "Please fill out all required fields. Name, description, frequency, Repetitions Per Frequency, Start Date",
        {
          containerId: "toast-notify",
        }
      );
    }

    if (
      formData.habit_frequency === "Weekly" &&
      formData.days_of_week_to_complete.length === 0
    ) {
      return toast.error("Please select at least one day for weekly habit.", {
        containerId: "toast-notify",
      });
    }
    if (
      formData.habit_frequency === "Monthly" &&
      !formData.day_of_month_to_complete
    ) {
      return toast.error(
        "Please select a day of the month for monthly habit.",
        { containerId: "toast-notify" }
      );
    }
    if (
      formData.habit_frequency === "Yearly" &&
      (!formData.yearly_month_of_year_to_complete ||
        !formData.yearly_day_of_year_to_complete)
    ) {
      return toast.error("Please select a month and day for yearly habit.", {
        containerId: "toast-notify",
      });
    }

    setFormData((prevData) => ({
      ...prevData,
      habit_frequency: prevData.habit_frequency.toLowerCase(),
      habit_task_completed: false,
    }));

    const tokenData = GetCookies("authToken");
    setIsUpdating(true);

    await axios
      .put(`${API}/habbits/${habit.id}`, formData, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then(async () => {
        toast.success("Habit updated successfully", {
          containerId: "toast-notify",
        });

        await getUserHabits();

        return setTimeout(() => {
          onCancel();
        }, 1500);
      })
      .catch(() => {
        return toast.error("Failed to update habit", {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="habitName">
        <Form.Label>Name *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter habit name"
          name="habit_name"
          value={formData.habit_name}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="habitTask">
        <Form.Label className="habit-form-label">Description *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description (Ex: Do 50 pushups)"
          name="habit_task_description"
          value={formData.habit_task_description}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="habitCategory">
        <Form.Label>Category</Form.Label>
        <Form.Select
          name="habit_category"
          value={formData.habit_category || "Select category"}
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
          value={formData.habit_frequency}
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
      {formData.habit_frequency === "Weekly" && (
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
                checked={formData.days_of_week_to_complete.includes(dayIndex)}
                onChange={handleDayOfWeekChange}
              />
            ))}
          </div>
        </Form.Group>
      )}

      {/* Conditional rendering for Monthly habits */}
      {formData.habit_frequency === "Monthly" && (
        <Form.Group controlId="dayOfMonth">
          <Form.Label>Day of Month *</Form.Label>
          <Form.Control
            type="number"
            name="day_of_month_to_complete"
            value={formData.day_of_month_to_complete || ""}
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
      {formData.habit_frequency === "Yearly" && (
        <>
          <Form.Group controlId="yearlyMonth">
            <Form.Label>Month of Year (1–12) *</Form.Label>
            <Form.Control
              type="number"
              name="yearly_month_of_year_to_complete"
              value={formData.yearly_month_of_year_to_complete || ""}
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
              value={formData.yearly_day_of_year_to_complete || ""}
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
          value={formData.repetitions_per_frequency}
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
            const paste = (e.clipboardData || window.Clipboard).getData("text");
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
          value={formData.start_date}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleInputChange}
        />
      </Form.Group>
      <div className="flex justify-center gap-8 my-4">
        <Form.Group controlId="isActive">
          <Form.Check
            type="checkbox"
            label="Mark as Active?"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="habitCompleted">
          <Form.Check
            type="checkbox"
            label="Mark as Completed?"
            name="has_reached_end_date"
            checked={formData.has_reached_end_date}
            onChange={handleInputChange}
          />
        </Form.Group>
      </div>
      <div className="flex justify-center gap-8 my-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>

      {isUpdating && <Loading message="Updating habit..." />}
    </Form>
  );
};
