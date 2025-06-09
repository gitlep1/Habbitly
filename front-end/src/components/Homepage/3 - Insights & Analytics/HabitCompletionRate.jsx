import { useContext, useEffect, useState, useMemo } from "react";

import { themeContext } from "../../../CustomContexts/Contexts";

import { getScheduledDates } from "./getScheduledDates";

export const HabitCompletionRate = ({ userHabits }) => {
  const { themeState } = useContext(themeContext);

  const averageCompletion = useMemo(() => {
    if (!userHabits || userHabits.length === 0) return null;

    let totalScheduled = 0;
    let totalCompleted = 0;

    userHabits.forEach((habit) => {
      const scheduledDates = getScheduledDates(habit);
      const completedDates = new Set(
        habit.log_dates?.map((date) => date.split("T")[0])
      );

      totalScheduled += scheduledDates.length;

      scheduledDates.forEach((date) => {
        if (completedDates.has(date)) {
          totalCompleted += 1;
        }
      });
    });

    if (totalScheduled === 0) return 0;
    return ((totalCompleted / totalScheduled) * 100).toFixed(1);
  }, [userHabits]);

  if (!userHabits || userHabits.length === 0) {
    return (
      <div className="p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Habit Progression</h2>
        <p className={themeState === "dark" ? "text-white" : "text-black"}>
          No habits to display yet. Add some!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Habit Tasks Completion</h2>

      <div className="relative w-45 h-45">
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {averageCompletion}%
        </div>
        <div className="w-full h-full rounded-full border-[10px] border-orange-400 border-t-blue-700"></div>
      </div>
    </div>
  );
};
