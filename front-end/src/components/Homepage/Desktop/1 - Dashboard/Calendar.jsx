import { useState, useEffect } from "react";
import { Image, Button } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import maxwell from "../../../../assets/images/Dashboard-images/Maxwell.png";

export const Calendar = ({}) => {
  const [view, setView] = useState("monthly");
  const [displayDates, setDisplayDates] = useState([]);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  useEffect(() => {
    generateDates();
  }, [view, currentMonthOffset]); // eslint-disable-line

  const getTargetDate = () => {
    const today = new Date();
    const target = new Date(
      today.setMonth(today.getMonth() + currentMonthOffset)
    );
    return new Date(target.getFullYear(), target.getMonth(), 1);
  };

  const generateDates = () => {
    const baseDate = getTargetDate();
    const today = new Date();
    const dates = [];

    if (view === "daily") {
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const day = today.getDate();

      const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
      const validDay = Math.min(day, daysInTargetMonth);

      dates.push(new Date(year, month, validDay));
    } else if (view === "weekly") {
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
    } else if (view === "monthly") {
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
      }
    }

    setDisplayDates(dates);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  const formatDateLabel = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    });
  };

  const getMonthLabel = () => {
    const targetDate = getTargetDate();
    return targetDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-card-header">
          <Image
            src={maxwell}
            alt="maxwell-calendar-card"
            id="calendar-cloud"
          />
          <h3>Calendar</h3>
        </div>

        <div className="calendar-card-content">
          <div className="calendar-card-content-header">
            <div className="calendar-card-content-header-month">
              <Button
                variant="light"
                onClick={() => setCurrentMonthOffset(currentMonthOffset - 1)}
              >
                <FaAngleLeft />
              </Button>
              <h2>{getMonthLabel()}</h2>
              <Button
                variant="light"
                onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
              >
                <FaAngleRight />
              </Button>
            </div>
            <div className="calendar-card-content-header-buttons">
              <Button variant="dark" onClick={() => setView("daily")}>
                Daily
              </Button>{" "}
              <Button variant="dark" onClick={() => setView("weekly")}>
                Weekly
              </Button>{" "}
              <Button variant="dark" onClick={() => setView("monthly")}>
                Monthly
              </Button>
            </div>
          </div>
          {/* TODO: Add a feature where users can click on a day and it opens a modal showing any habits, goals, tasks the user has set for that day */}
          {displayDates.map((date, i) => (
            <div
              className={`calendar-card-content-day ${
                isToday(date) ? "current-day" : ""
              }`}
              key={i}
            >
              <h3>{formatDateLabel(date)}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
