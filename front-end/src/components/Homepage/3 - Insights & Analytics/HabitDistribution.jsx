import { useContext } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { themeContext } from "../../../CustomContexts/Contexts";

const categoryColors = {
  Creativity: "#FFD700",
  "Emotional Well-being": "#9370DB",
  Financial: "#228B22",
  Learning: "#1E90FF",
  "Mental Health": "#6495ED",
  Nutrition: "#FF6347",
  Physical: "#DC143C",
  Productivity: "#FFA500",
  Relationships: "#FF69B4",
  "Self-Care": "#87CEEB",
  Spiritual: "#800080",
  "Work/Career": "#4682B4",
  "No category": "#808080",
};

export const HabitDistribution = ({ userHabits }) => {
  const { themeState } = useContext(themeContext);

  if (!userHabits || userHabits.length === 0) {
    return (
      <div className="p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Habit Category Distribution
        </h2>
        <p className={themeState === "dark" ? "text-white" : "text-black"}>
          No habits to display yet. Add some!
        </p>
      </div>
    );
  }

  const categoryCounts = userHabits.reduce((acc, habit) => {
    const category = habit.habit_category
      ? habit.habit_category
      : "No category";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const totalHabits = userHabits.length;
  const activeCategories = Object.keys(categoryCounts).filter(
    (category) => categoryCounts[category] > 0
  );

  return (
    <div className="p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Habit Category Distribution
      </h2>

      <div className="h-8 w-full flex rounded-full overflow-hidden mb-4 border border-gray-200">
        {activeCategories.map((category) => {
          const percentage = (categoryCounts[category] / totalHabits) * 100;
          const color = categoryColors[category];
          const id = `tooltip-${category.replace(/\s/g, "")}`;

          return (
            <div
              key={category}
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
              className="h-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80"
              data-tooltip-id={id}
              data-tooltip-content={`${category}: ${
                categoryCounts[category]
              } habit(s) (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
        {activeCategories.map((category) => (
          <div key={category} className="flex items-center">
            <span
              className="block w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: categoryColors[category] }}
            />
            <span
              className={`text-sm ${
                themeState === "dark" ? "text-white" : "text-black"
              }`}
            >
              {category}
            </span>
          </div>
        ))}
      </div>

      {activeCategories.map((category) => {
        const id = `tooltip-${category.replace(/\s/g, "")}`;
        return <ReactTooltip key={id} id={id} place="top" effect="solid" />;
      })}
    </div>
  );
};
