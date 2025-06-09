import { useContext, useState, useEffect } from "react";
import { parseISO, differenceInMinutes } from "date-fns";

import { themeContext } from "../../../CustomContexts/Contexts";
import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

const TIME_SPENT_COOKIE_NAME = "totalTimeSpentMinutes";
const LAST_ACTIVITY_COOKIE_NAME = "lastActivityTimestamp";

export const HabitSessionTime = ({ userHabits }) => {
  const { themeState } = useContext(themeContext);

  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let storedTime = parseInt(GetCookies(TIME_SPENT_COOKIE_NAME) || "0", 10);
    const lastActivity = GetCookies(LAST_ACTIVITY_COOKIE_NAME);

    if (lastActivity) {
      const lastActivityDate = parseISO(lastActivity);
      const currentTime = new Date();
      const minutesElapsed = differenceInMinutes(currentTime, lastActivityDate);

      if (minutesElapsed > 0 && minutesElapsed < 1440) {
        storedTime += minutesElapsed;
      }
    }

    setTimeSpent(storedTime);

    const intervalId = setInterval(() => {
      setTimeSpent((prevTime) => {
        const newTime = prevTime + 1;
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        SetCookies(TIME_SPENT_COOKIE_NAME, newTime.toString(), expirationDate);
        SetCookies(
          LAST_ACTIVITY_COOKIE_NAME,
          new Date().toISOString(),
          expirationDate
        );
        return newTime;
      });
    }, 60 * 1000);

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    if (
      !lastActivity ||
      differenceInMinutes(new Date(), parseISO(lastActivity)) > 1440
    ) {
      SetCookies(
        LAST_ACTIVITY_COOKIE_NAME,
        new Date().toISOString(),
        expirationDate
      );
    }

    return () => clearInterval(intervalId);
  }, []);

  const formatTimeSpent = (totalMinutes) => {
    if (totalMinutes < 1) return "Less than a minute";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Longest Session Time</h2>

      <div className="relative w-45 h-45">
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {formatTimeSpent(timeSpent)}
        </div>
        <div className="w-full h-full rounded-full border-[10px] border-orange-400 border-t-blue-700"></div>
      </div>
    </div>
  );
};
