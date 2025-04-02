import "./Dashboard.scss";
import { useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { FaCloudversify } from "react-icons/fa";
import { GetCookies } from "../../../../CustomFunctions/HandleCookies";

import richard from "../../../../assets/images/Dashboard-images/richard-logo-2.png";
import richardEye from "../../../../assets/images/Dashboard-images/richard-eye-2.png";

export const Dashboard = () => {
  const richardContainerRef = useRef(null);
  const anchorRef = useRef(null);

  const userData = GetCookies("authUser") || null;

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  });

  const handlePointerMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const anchor = anchorRef.current;
    const rect = anchor.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top + rect.height / 2;

    const angleDeg = angle(mouseX, mouseY, anchorX, anchorY);

    const eyes = document.querySelectorAll(".eye");
    eyes.forEach((eye) => {
      eye.style.transform = `rotate(${-90 + angleDeg}deg)`;
    });
  };

  const angle = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    return deg;
  };

  const greetingInUserTimezone = (date) => {
    const userDate = new Date(date);
    const userHour = userDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (userHour < 12) {
      return "Good Morning";
    } else if (userHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const dateInUserTimezone = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="desktop-dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>
            Dashboard
            <FaCloudversify />
          </h1>
          <div className="fancy-line"></div>
          <div className="daily-date">
            <span id="today">Today&apos;s Date:</span>
            <span id="date">{dateInUserTimezone(new Date())}</span>
          </div>
        </div>
        <div className="dashboard-welcome">
          <h1>HABBITLY</h1>
          <p>
            {greetingInUserTimezone(new Date())},{" "}
            <span id="username">
              {userData ? ` ${userData.username}` : " User"}
            </span>
            !
          </p>
        </div>
        <div ref={richardContainerRef} className="richard-container">
          <Image
            ref={anchorRef}
            id="anchor"
            src={richard}
            alt="Habbitly Dashboard logo"
          />
          <div id="eyes">
            <Image
              className="eye"
              src={richardEye}
              alt="Habbitly Dashboard logo eyes"
            />
            <Image
              className="eye eye2"
              src={richardEye}
              alt="Habbitly Dashboard logo eyes"
            />
          </div>
        </div>
      </div>

      <div className="dashboard-active-habit">
        <h1>Active Habit</h1>
      </div>
      <div className="dashboard-calendar">
        <h1>Calendar</h1>
      </div>
      <div className="dashboard-notifications">
        <h1>Notifications</h1>
      </div>
    </section>
  );
};
