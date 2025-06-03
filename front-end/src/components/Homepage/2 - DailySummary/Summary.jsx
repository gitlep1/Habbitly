import "./Summary.scss";
import { useState, useEffect, useContext, useCallback } from "react";
import { Image } from "react-bootstrap";
import {
  format,
  isSameDay,
  parseISO,
  differenceInMinutes,
  startOfDay,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { processHabitsForCalendarLogic } from "../1 - Dashboard/calendar-functions/processHabitsForCalendar";

import Sunny from "../../../assets/images/summary-images/Sunny.png";
import { habitContext } from "../../../CustomContexts/Contexts";

import { motivationalMessages } from "./motivationalMessages";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

const MESSAGE_COOKIE_NAME = "dailyMotivationalMessage";
const MESSAGE_DATE_COOKIE_NAME = "dailyMotivationalMessageDate";
const TIMEZONE = "America/New_York";

const TIME_SPENT_COOKIE_NAME = "totalTimeSpentMinutes";
const LAST_ACTIVITY_COOKIE_NAME = "lastActivityTimestamp";

export const Summary = () => {
  const { userHabits, getUserHabits } = useContext(habitContext);

  const [todayHabits, setTodayHabits] = useState([]);
  const [tasksCompletedCount, setTasksCompletedCount] = useState(0);
  const [totalTasksToday, setTotalTasksToday] = useState(0);
  const [habitsOnStreakCount, setHabitsOnStreakCount] = useState(0);
  const [dailyMessage, setDailyMessage] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [processedHabitDataByDate, setProcessedHabitDataByDate] = useState(
    new Map()
  );

  useEffect(() => {
    fetchAllHabits();
  }, []); // eslint-disable-line

  const fetchAllHabits = async () => {
    setLoading(true);
    setError(null);

    try {
      await getUserHabits();
    } catch (err) {
      console.error("Error fetching all habits:", err);
      setError("Failed to load summary.");
    } finally {
      setLoading(false);
    }
  };

  const processHabitsForCalendar = useCallback(() => {
    processHabitsForCalendarLogic(
      userHabits,
      new Date(),
      setProcessedHabitDataByDate
    );
  }, [userHabits, setProcessedHabitDataByDate]);

  useEffect(() => {
    if (userHabits.length > 0) {
      processHabitsForCalendar();
    }
  }, [userHabits, processHabitsForCalendar]);

  useEffect(() => {
    const today = startOfDay(new Date());
    const todayFormatted = format(today, "yyyy-MM-dd");

    const habitsForToday = processedHabitDataByDate.get(todayFormatted) || [];
    setTodayHabits(habitsForToday);
    setTotalTasksToday(habitsForToday.length);

    let completedCount = 0;
    let activeStreakCount = 0;
    habitsForToday.forEach((habit) => {
      const wasCompletedToday = habit.last_completed_on
        ? isSameDay(parseISO(habit.last_completed_on), today)
        : false;

      if (wasCompletedToday) {
        completedCount++;
      }

      if (habit.current_streak && habit.current_streak > 0) {
        activeStreakCount++;
      }
    });
    setTasksCompletedCount(completedCount);
    setHabitsOnStreakCount(activeStreakCount);
  }, [processedHabitDataByDate]);

  useEffect(() => {
    const now = new Date();
    const zonedNow = toZonedTime(now, TIMEZONE);
    const todayFormatted = format(zonedNow, "yyyy-MM-dd");

    const savedMessageIndex = GetCookies(MESSAGE_COOKIE_NAME);
    const savedMessageDate = GetCookies(MESSAGE_DATE_COOKIE_NAME);

    let messageToDisplay = "";
    let newIndex = 0;

    if (
      savedMessageIndex &&
      savedMessageDate &&
      isSameDay(parseISO(savedMessageDate), zonedNow)
    ) {
      newIndex = parseInt(savedMessageIndex, 10);
      messageToDisplay = motivationalMessages[newIndex];
    } else {
      let previousIndex = savedMessageIndex
        ? parseInt(savedMessageIndex, 10)
        : -1;

      do {
        newIndex = Math.floor(Math.random() * motivationalMessages.length);
      } while (newIndex === previousIndex && motivationalMessages.length > 1);

      messageToDisplay = motivationalMessages[newIndex];

      const nextDayZoned = toZonedTime(
        new Date(
          zonedNow.getFullYear(),
          zonedNow.getMonth(),
          zonedNow.getDate() + 1
        ),
        TIMEZONE
      );

      SetCookies(MESSAGE_COOKIE_NAME, newIndex.toString(), nextDayZoned);
      SetCookies(MESSAGE_DATE_COOKIE_NAME, todayFormatted, nextDayZoned);
    }
    setDailyMessage(messageToDisplay);
  }, []);

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
    <section className="summary-container w-[95dvw] min-h-screen mx-auto">
      <div className="summary-header text-center">
        <h1 className="text-4xl font-bold">Daily Summary</h1>
        <p className="text-md mt-1">An overview of your activities today</p>
      </div>

      <div className="flex flex-col items-center">
        <Image src={Sunny} alt="Sun Character" className="sunny mb-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {loading ? (
          <div className="loading-indicator">Loading Summary...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="summary-box task-completed-box bg-dark-blue p-6 rounded-xl shadow-md w-[250px] text-center">
              <h3>
                Tasks <br /> completed
              </h3>
              <h2 className="text-3xl font-bold">
                {tasksCompletedCount} / {totalTasksToday}
              </h2>
            </div>

            <div className="summary-box today-habits-box bg-dark-blue p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Today&apos;s Habits
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1 max-h-20 overflow-y-auto">
                {todayHabits.length > 0 ? (
                  todayHabits.map((habit) => (
                    <li key={habit.id}>{habit.habit_name}</li>
                  ))
                ) : (
                  <li>No habits scheduled for today!</li>
                )}
              </ul>
            </div>

            <div className="summary-box streak-box bg-orange-gradient p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">Habits on Streak</h3>
              <p className="text-4xl font-bold mt-1 flex justify-center">
                {habitsOnStreakCount}{" "}
              </p>
            </div>

            <div className="summary-box time-spent-box bg-dark-blue p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">Total Session Time</h3>
              <p className="text-3xl font-bold mt-1">
                {formatTimeSpent(timeSpent)}
              </p>
            </div>
          </>
        )}

        <div className="summary-box progress-box bg-dark-blue p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Today&apos;s Insight</h3>
          <p className="mt-1">{dailyMessage}</p>
        </div>
      </div>
    </section>
  );
};
