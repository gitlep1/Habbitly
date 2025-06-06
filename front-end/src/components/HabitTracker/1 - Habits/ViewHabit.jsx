import { useState, useContext } from "react";
import { PropTypes } from "prop-types";
import { Offcanvas, Button, Modal } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";

import { habitContext } from "../../../CustomContexts/Contexts";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import { Loading } from "../../../CustomFunctions/Loading/Loading";

import { EditHabit } from "./EditHabit";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ViewHabit = ({ habitData, show, onClose }) => {
  const { getUserHabits } = useContext(habitContext);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    const authToken = GetCookies("authToken");

    setisDeleting(true);

    return axios
      .delete(`${API}/habbits/${habitData.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Habit deleted successfully", {
          containerId: "toast-notify",
        });
        getUserHabits();
        setShowDeleteModal(false);
        onClose();
      })
      .catch((err) => {
        console.error("Error deleting habit:", err);
        toast.error("Error deleting habit");
      })
      .finally(() => {
        setisDeleting(false);
      });
  };

  return (
    <>
      <Offcanvas show={show} onHide={onClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="view-habit-modal-title">
            {isEditing ? (
              `Editing ${habitData.habit_name}`
            ) : (
              <div className="flex items-center">
                <BsTrashFill
                  className="text-red-400 hover:cursor-pointer"
                  onClick={() => setShowDeleteModal(true)}
                />{" "}
                {habitData.habit_name}
              </div>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
              <p>
                <span className="font-bold">Task:</span>{" "}
                {habitData.habit_task_description}
              </p>
              <p>
                <span className="font-bold">Category:</span>{" "}
                {habitData.habit_category || "Not Set"}
              </p>
              <p>
                <span className="font-bold">Frequency:</span>{" "}
                {habitData.habit_frequency}
              </p>
              <p>
                <span className="font-bold">Progress:</span>{" "}
                {habitData.progress_percentage
                  ? `${habitData.progress_percentage}%`
                  : "No progress yet"}
              </p>
              <p>
                <span className="font-bold">Times per frequency:</span>{" "}
                {habitData.repetitions_per_frequency}
              </p>
              <p>
                <span className="font-bold">Start date:</span>{" "}
                {formatDate(habitData.start_date)}
              </p>
              <p>
                <span className="font-bold">Last completed on:</span>{" "}
                {habitData.last_completed_on
                  ? formatDate(habitData.last_completed_on)
                  : "No completions yet"}
              </p>
              <p>
                <span className="font-bold">End date:</span>{" "}
                {habitData.end_date
                  ? formatDate(habitData.end_date)
                  : "Infinite"}
              </p>
              <p>
                <span className="font-bold">Habit active:</span>{" "}
                {habitData.is_active ? "Active" : "Paused"}
              </p>
              <p>
                <span className="font-bold">Habit completed:</span>{" "}
                {habitData.has_reached_end_date ? (
                  <span
                    style={{
                      color: "var(--success-color)",
                      fontWeight: "bold",
                    }}
                  >
                    Completed! 🎉
                  </span>
                ) : (
                  "Not yet"
                )}
              </p>
            </>
          )}
        </Offcanvas.Body>
        <div className="view-habit-footer-buttons p-3">
          {!isEditing && (
            <Button variant="primary" onClick={handleEditClick}>
              Edit
            </Button>
          )}

          {!isEditing && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </Offcanvas>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this habit?{" "}
          <span className="font-bold text-red-500">
            This action is irreversible
          </span>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="danger" onClick={handleDeleteConfirm}>
            {isDeleting ? <Loading /> : "Delete"}
          </Button>
          <Button variant="primary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ViewHabit.propTypes = {
  habitData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    habit_name: PropTypes.string.isRequired,
    habit_task_description: PropTypes.string.isRequired,
    habit_task_completed: PropTypes.bool.isRequired,
    habit_category: PropTypes.string,
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
