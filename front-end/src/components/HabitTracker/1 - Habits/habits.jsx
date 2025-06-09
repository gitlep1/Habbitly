import "./habits.scss";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Image } from "react-bootstrap";
import { Button } from "@mui/material";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  startOfDay,
} from "date-fns";
import axios from "axios";

import { habitContext } from "../../../CustomContexts/Contexts";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";
import { Loading } from "../../../CustomFunctions/Loading/Loading";

import corey from "../../../assets/images/habit-tracker-images/Corey.png";

import { AddAHabit } from "./AddAHabit";
import { ViewHabit } from "./ViewHabit";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Habits = () => {
  const completingHabits = useRef({});
  const { userHabits, setUserHabits, getUserHabits } = useContext(habitContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeHabitId, setActiveHabitId] = useState(null);
  const [completionIsLoading, setCompletionIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserHabits();
  }, []); // eslint-disable-line

  const fetchUserHabits = async () => {
    setIsLoading(true);
    try {
      await getUserHabits();
    } catch (err) {
      setError("Failed to fetch user habits", err?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleHabitClick = (id) => {
    setActiveHabitId(id);
  };

  const handleQuickComplete = useCallback(
    async (habitId) => {
      if (completingHabits.current[habitId]) return;

      const authToken = GetCookies("authToken");
      const habitToUpdate = userHabits.find((habit) => habit.id === habitId);
      const originalHabitState = { ...habitToUpdate };

      completingHabits.current[habitId] = true;
      setCompletionIsLoading(true);
      setError("");

      const today = startOfDay(new Date()).toISOString();

      const dataToSend = {
        ...habitToUpdate,
        last_completed_on: today,
      };

      await axios
        .put(`${API}/habbits/${habitId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(async () => {
          await getUserHabits();
        })
        .catch((err) => {
          console.error("Failed to quick complete habit:", err);
          setError(err?.response?.data?.error || "Failed to quick complete.");
          setUserHabits((prev) =>
            prev.map((habit) =>
              habit.id === habitId ? originalHabitState : habit
            )
          );
        })
        .finally(() => {
          setCompletionIsLoading(false);
          delete completingHabits.current[habitId];
        });
    },
    [userHabits, getUserHabits, setUserHabits]
  );

  const isHabitCompleted = (habit, now = new Date()) => {
    const logDates = habit.log_dates || [];

    if (!Array.isArray(logDates) || logDates.length === 0) {
      return false;
    }

    return logDates.some((log) => {
      const completedDate = new Date(log);

      switch (habit.habit_frequency) {
        case "Daily":
          return isSameDay(now, completedDate);

        case "Weekly":
          return isSameWeek(now, completedDate, { weekStartsOn: 1 });

        case "Monthly":
          return isSameMonth(now, completedDate);

        case "Yearly":
          return isSameYear(now, completedDate);

        default:
          return false;
      }
    });
  };

  return (
    <div className="habit-tracker-container pl-4 pr-4 md:pl-8 md:pr-0 min-h-screen">
      <div className="max-w-7xl mx-auto mt-[7em] md:mt-0">
        <div className="top-section flex flex-col lg:flex-row items-center lg:items-start lg:justify-between mb-8 lg:mb-12 relative">
          <div className="rainbow-cloud-container relative flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
            <Image
              src={corey}
              alt="Rainbow Cloud corey"
              className="corey object-contain"
            />
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-grow">
            <div className="flex flex-col">
              <h1 className="habit-title">Habit Tracker</h1>
              <span className="text-3xl">Habit & Goal Tracking</span>
            </div>
          </div>
        </div>
        <div className="habit-cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            className="habit-card add-habit-card p-4 rounded-2xl shadow-lg flex items-center justify-center text-center relative overflow-hidden cursor-pointer"
            onClick={() => handleAddClick()}
          >
            <span className="text-6xl text-gray-400">Add a Habit</span>
          </div>

          {error && <p className="text-center text-danger">ERROR: {error}</p>}

          {userHabits.map((habit) => {
            const {
              id,
              habit_name,
              habit_task_description,
              habit_category,
              habit_frequency,
              repetitions_per_frequency,
              progress_percentage,
              start_date,
              log_dates,
              end_date,
              is_active,
              has_reached_end_date,
              days_of_week_to_complete,
              day_of_month_to_complete,
              yearly_month_of_year_to_complete,
              yearly_day_of_year_to_complete,
            } = habit;

            const isCompleted = isHabitCompleted(habit);

            return (
              <div
                key={id}
                className="habit-card p-4 rounded-2xl shadow-lg flex flex-col justify-between text-center relative"
              >
                <div className="habit-card-icon absolute top-2 right-2 text-sm text-gray-500">
                  <span>{habit_category}</span>
                </div>

                <div className="habit-complete-icon-outer absolute top-2 left-2 rounded-circle">
                  {isCompleted ? (
                    <div
                      className="habit-complete-icon-inner habit-completed"
                      title="Habit Completed"
                    >
                      {completionIsLoading ? (
                        <Loading message={""} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div
                      className="habit-complete-icon-inner cursor-pointer"
                      onClick={() => handleQuickComplete(id)}
                      title="Quick Complete"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="habit-name text-lg font-semibold">
                  {habit_name}
                </h3>

                <div className="flex flex-col gap-1 mb-4">
                  <p className="habit-description">{habit_task_description}</p>
                  {!has_reached_end_date ? (
                    <p
                      className={
                        isCompleted ? "text-green-500" : "text-red-500"
                      }
                    >
                      {isCompleted
                        ? `${habit_frequency} task completed`
                        : `${habit_frequency} task not completed yet`}
                    </p>
                  ) : (
                    <p className="text-blue-500">Habit Fully Completed</p>
                  )}
                </div>

                <Button
                  variant="outlined"
                  color="warning"
                  className="habit-card-button px-4 py-2 rounded-full text-sm font-bold"
                  onClick={() => handleHabitClick(habit.id)}
                >
                  View
                </Button>

                {activeHabitId === habit.id && (
                  <ViewHabit
                    habitData={habit}
                    show={true}
                    onClose={() => setActiveHabitId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showAddModal && (
        <AddAHabit
          showAddModal={showAddModal}
          onHide={() => setShowAddModal(false)}
          getUserHabits={getUserHabits}
        />
      )}
    </div>
  );
};
