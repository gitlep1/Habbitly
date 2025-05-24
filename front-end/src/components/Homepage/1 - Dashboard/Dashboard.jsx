import "./Dashboard.scss";
import { useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { FaCloudversify } from "react-icons/fa";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import richard from "../../../assets/images/Dashboard-images/richard-logo-2.png";
import richardEye from "../../../assets/images/Dashboard-images/richard-eye-2.png";

import { ActiveHabit } from "./ActiveHabit";
import { Calendar } from "./Calendar";
import { SiteNews } from "./SiteNews";

export const Dashboard = () => {
  const richardContainerRef = useRef(null);
  const anchorRef = useRef(null);

  const userData = GetCookies("authUser") || null;

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
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
    <section className="desktop-dashboard-container p-4 md:p-8 min-h-screen min-w-screen">
      <div className="dashboard-header max-w-5xl mx-auto mt-[6em] md:mt-0 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3">
        <div className="dashboard-title md:col-2 lg:col-3 lg:row-1">
          <h1>
            Dashboard
            <FaCloudversify />
          </h1>
          <div className="fancy-line mx-auto"></div>
          <div className="daily-date">
            <span id="today">Today&apos;s Date:</span>
            <span id="date">{dateInUserTimezone(new Date())}</span>
          </div>
        </div>
        <div className="dashboard-welcome md:col-1 md:row-1">
          <h1>HABBITLY</h1>
          <p>
            {greetingInUserTimezone(new Date())},{" "}
            <span id="username">
              {userData ? ` ${userData.username}` : " User"}
            </span>
            !
          </p>
        </div>
        <div
          ref={richardContainerRef}
          className="richard-container lg:col-2 lg:row-1"
        >
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
              className="eye"
              src={richardEye}
              alt="Habbitly Dashboard logo eyes"
            />
          </div>
          <p className="slogan">Commit to Growth. Habbitly Helps.</p>
        </div>
      </div>

      <div className="dashboard-content">
        <ActiveHabit />
        <Calendar />
        <SiteNews />
      </div>
    </section>
  );
};
