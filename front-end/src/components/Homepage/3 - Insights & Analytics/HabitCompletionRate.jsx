import { useContext, useEffect, useState } from "react";

import { themeContext } from "../../../CustomContexts/Contexts";

export const HabitCompletionRate = ({ userHabits }) => {
  const { themeState } = useContext(themeContext);

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
    <div className="p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Habit Tasks Completion</h2>
    </div>
  );
};
