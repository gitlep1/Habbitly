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
    const handleEyeRotation = (e) => {
      updateEyeRotation(e.clientX, e.clientY, anchorRef);
    };

    const handleTouchMove = (e) => {
      // e.touches is a list of all current touch points on the screen.
      if (e.touches.length > 0) {
        const touch = e.touches[0];

        // grab x and y position of the touch
        updateEyeRotation(touch.clientX, touch.clientY, anchorRef);
      }
    };

    window.addEventListener("pointermove", handleEyeRotation);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("pointermove", handleEyeRotation);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [anchorRef]); // eslint-disable-line

  const getEyeElementsAndPositions = () => {
    const eyes = document.querySelectorAll(".eye");

    const leftEye = eyes[0];
    const rightEye = eyes[1];

    // getBoundingClientRect() returns the position and size of an element relative to the viewport
    // including its: top, left, width, and height
    const leftEyeRect = leftEye.getBoundingClientRect();
    const rightEyeRect = rightEye.getBoundingClientRect();

    return {
      leftEye: leftEye,
      rightEye: rightEye,

      // Calculate the center of each eye by adding half the width and height
      leftEyeCenterX: leftEyeRect.left + leftEyeRect.width / 2,
      leftEyeCenterY: leftEyeRect.top + leftEyeRect.height / 2,
      rightEyeCenterX: rightEyeRect.left + rightEyeRect.width / 2,
      rightEyeCenterY: rightEyeRect.top + rightEyeRect.height / 2,
    };
  };

  const updateEyeRotation = (mouseX, mouseY, anchorRef) => {
    if (!anchorRef.current) return;

    const eyeData = getEyeElementsAndPositions();
    if (!eyeData) return;

    const {
      leftEye,
      rightEye,
      leftEyeCenterX,
      leftEyeCenterY,
      rightEyeCenterX,
      rightEyeCenterY,
    } = eyeData;

    // anchor element position
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const anchorX = anchorRect.left + anchorRect.width / 2;
    const anchorY = anchorRect.top + anchorRect.height / 2;

    // Thresholds for the cross-eyed zone
    const centerThresholdX = 40;
    const centerThresholdY = 40;

    const distXFromAnchor = mouseX - anchorX;
    const distYFromAnchor = mouseY - anchorY;

    // Calculate a virtual 'cross-eyed' target point (center of the two eyes)
    const virtualCrossX = (leftEyeCenterX + rightEyeCenterX) / 2;
    const virtualCrossY = (leftEyeCenterY + rightEyeCenterY) / 2;

    // Angle for each eye to look inward toward the center (cross-eyed)
    const crossEyedLeftTargetAngle = calculateAngle(
      leftEyeCenterX,
      leftEyeCenterY,
      virtualCrossX,
      virtualCrossY
    );

    const crossEyedRightTargetAngle = calculateAngle(
      rightEyeCenterX,
      rightEyeCenterY,
      virtualCrossX,
      virtualCrossY
    );

    // Calculate the angle for each eye to follow the actual pointer
    const leftFollowAngle = calculateAngle(
      leftEyeCenterX,
      leftEyeCenterY,
      mouseX,
      mouseY
    );
    const rightFollowAngle = calculateAngle(
      rightEyeCenterX,
      rightEyeCenterY,
      mouseX,
      mouseY
    );

    // Distance from mouse to center of "cross-eyed zone"
    const distanceToCenter = Math.hypot(distXFromAnchor, distYFromAnchor);
    const maxDistance = Math.hypot(centerThresholdX, centerThresholdY);

    // Interpolation factor: 0 = fully cross-eyed, 1 = fully following the pointer
    const t = Math.min(distanceToCenter / maxDistance, 1);

    // smoothly transition between the cross-eyed and pointer-following angles
    const leftEyeAngle =
      crossEyedLeftTargetAngle * (1 - t) + leftFollowAngle * t;
    const rightEyeAngle =
      crossEyedRightTargetAngle * (1 - t) + rightFollowAngle * t;

    leftEye.style.transform = `rotate(${leftEyeAngle}deg)`;
    rightEye.style.transform = `rotate(${rightEyeAngle}deg)`;
  };

  const calculateAngle = (eyeX, eyeY, pointerX, pointerY) => {
    const deltaY = pointerY - eyeY;
    const deltaX = pointerX - eyeX;

    // Use atan2 to compute the angle from the eye to the pointer
    // atan2(y, x) returns the angle between the x-axis and the point (x, y)
    // In this case we reverse Y to flip the direction (SVG/HTML coordinates go down)
    const radians = Math.atan2(deltaX, -deltaY);
    const degrees = (radians * 180) / Math.PI;
    return degrees;
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
      <div className="dashboard-header max-w-5xl mx-auto mt-[7em] md:mt-0 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3">
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
