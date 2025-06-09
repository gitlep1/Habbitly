import "./Insights.scss";
import { useContext, useEffect } from "react";
import { Image } from "react-bootstrap";

import { habitContext } from "../../../CustomContexts/Contexts";

import { HabitProgression } from "./HabitProgression";
import { HabitDistribution } from "./HabitDistribution";
import { HabitCompletionRate } from "./HabitCompletionRate";
import { HabitSessionTime } from "./HabitSessionTime";

import anthony from "../../../assets/images/insights-images/Anthony.png";

export const Insights = () => {
  const { userHabits, getUserHabits } = useContext(habitContext);

  useEffect(() => {
    fetchAllHabits();
  }, []); // eslint-disable-line

  const fetchAllHabits = async () => {
    await getUserHabits();
  };

  return (
    <section className="insights-container p-4 md:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto mt-[7em] md:mt-0">
        <div className="flex flex-col sm:flex-row items-center justify-center space-x-4 mb-6">
          <Image
            src={anthony}
            alt="Anthony"
            className="anthony object-contain"
          />
          <div>
            <h1 className="text-4xl font-bold">Insights & Analytics</h1>
            <p className="text-gray-500 text-lg">Your statistics and trends</p>
          </div>
        </div>

        <div className="insights-content grid gap-6 md:grid-cols-2">
          {/* Habit Progression Chart */}
          <HabitProgression userHabits={userHabits} />

          {/* Time Spent */}
          <HabitSessionTime userHabits={userHabits} />

          {/* Habit Distribution */}
          <HabitDistribution userHabits={userHabits} />

          {/* Completion Rate */}
          <HabitCompletionRate userHabits={userHabits} />
        </div>
      </div>
    </section>
  );
};
