import "./habits.scss";
import { useState, useEffect, useContext } from "react";
import { Image } from "react-bootstrap";
import { Button } from "@mui/material";

import { habitContext } from "../../../CustomContexts/Contexts";

import corey from "../../../assets/images/habit-tracker-images/Corey.png";

import { AddAHabit } from "./AddAHabit";
import { ViewHabit } from "./ViewHabit";

export const Habits = () => {
  const { userHabits, getUserHabits } = useContext(habitContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeHabitId, setActiveHabitId] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserHabits = async () => {
      try {
        await getUserHabits();
      } catch (err) {
        setError("Failed to fetch user habits", err?.response?.data?.error);
      }
    };
    fetchUserHabits();
  }, []); // eslint-disable-line

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleHabitClick = (id) => {
    setActiveHabitId(id);
  };

  return (
    <div className="habit-tracker-container p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto mt-[6em] md:mt-0">
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
            <span className="text-6xl text-gray-400">+</span>
          </div>

          {error && <p className="text-center text-danger">ERROR: {error}</p>}

          {userHabits.map((habit) => {
            const {
              id,
              habit_name,
              habit_task_description,
              habit_task_completed,
              habit_category,
              habit_frequency,
              repetitions_per_frequency,
              progress_percentage,
              start_date,
              last_completed_on,
              end_date,
              is_active,
              has_reached_end_date,
              days_of_week_to_complete,
              day_of_month_to_complete,
              yearly_month_of_year_to_complete,
              yearly_day_of_year_to_complete,
            } = habit;

            return (
              <div
                key={id}
                className="habit-card p-4 rounded-2xl shadow-lg flex flex-col justify-between text-center relative"
              >
                <div className="habit-card-icon absolute top-2 right-2 text-sm text-gray-500">
                  <span>{habit_category}</span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{habit_name}</h3>

                <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                  <p>{habit_task_description}</p>
                  <p
                    className={
                      habit_task_completed ? "text-green-500" : "text-red-500"
                    }
                  >
                    {habit_task_completed
                      ? `${habit_frequency} task completed`
                      : `${habit_frequency} task not completed yet`}
                  </p>
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
