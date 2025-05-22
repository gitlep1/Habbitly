import "./habits.scss";
import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Button } from "@mui/material";
import axios from "axios";

import corey from "../../../assets/images/habit-tracker-images/Corey.png";

import { AddAHabit } from "./AddAHabit";
import { ViewHabit } from "./ViewHabit";

const mockHabitsData = [
  {
    id: "add-new-habit",
    isAddNew: true,
  },
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Morning Meditation",
    habit_task: "Meditate for 10 minutes",
    habit_task_completed: true,
    habit_category: "Mindfulness",
    habit_interval: "daily",
    habit_progress: 28,
    times_per_interval: 1,
    start_date: "2025-04-01",
    last_completed_date: "2025-05-20",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "b7c8d9e0-f1a2-3b4c-5d6e-7f8g9h0i1j2k",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Gym Workout",
    habit_task: "Go to the gym",
    habit_task_completed: false,
    habit_category: "Fitness",
    habit_interval: "weekly",
    habit_progress: 3,
    times_per_interval: 2,
    start_date: "2025-03-15",
    last_completed_date: "2025-05-12",
    end_date: "2025-06-30",
    is_active: true,
    habit_completed: false,
  },
  {
    id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Read a Book",
    habit_task: "Read for 30 minutes",
    habit_task_completed: true,
    habit_category: "Productivity",
    habit_interval: "daily",
    habit_progress: 15,
    times_per_interval: 1,
    start_date: "2025-05-01",
    last_completed_date: "2025-05-20",
    end_date: "2025-05-25",
    is_active: true,
    habit_completed: false,
  },
  {
    id: "d5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Hydration",
    habit_task: "Drink 8 glasses of water",
    habit_task_completed: false,
    habit_category: "Health",
    habit_interval: "daily",
    habit_progress: 40,
    times_per_interval: 1,
    start_date: "2025-02-20",
    last_completed_date: "2025-05-18",
    end_date: "2025-07-01",
    is_active: true,
    habit_completed: false,
  },
  {
    id: "e7f8g90-i1j2-k3l4-m5n6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e7f8g9h-i1j2-k3l4-m5n6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e79h0-i1j2-k3l4-m5n6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e7f8g9h0-i1j2-4-m5n6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e7f8g9h0-i1j2-k3l4-m5n6-o7p8q9rs1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e7f8g9h0-i12-k3l4-m5n6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
  {
    id: "e7f8g9h0-i1j2-k3l4-mn6-o7p8q9r0s1t2",
    user_id: "user-123e4567-e89b-12d3-a456-426614174000",
    habit_name: "Sleep Schedule",
    habit_task: "Sleep before 11 PM",
    habit_task_completed: true,
    habit_category: "Wellness",
    habit_interval: "daily",
    habit_progress: 60,
    times_per_interval: 1,
    start_date: "2025-01-10",
    last_completed_date: "2025-05-19",
    end_date: "2025-05-21",
    is_active: false,
    habit_completed: true,
  },
];

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Habits = () => {
  const [habitsData, setHabitsData] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeHabitId, setActiveHabitId] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    getUserHabits();
  }, []);

  const getUserHabits = async () => {
    await axios
      .get(`${API}/habbits/user`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.payload);
        setHabitsData(res.data.payload);
      })
      .catch((error) => {
        setError(error);
      });
  };

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

          {habitsData.map((habit) => {
            const {
              id,
              user_id,
              habit_name,
              habit_task,
              habit_task_completed,
              habit_category,
              habit_interval,
              habit_progress,
              times_per_interval,
              start_date,
              last_completed_date,
              end_date,
              is_active,
              habit_completed,
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
                  <p>{habit_task}</p>
                  <p
                    className={
                      habit_task_completed ? "text-green-500" : "text-red-500"
                    }
                  >
                    {habit_task_completed ? "Complete" : "Incomplete"}
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
