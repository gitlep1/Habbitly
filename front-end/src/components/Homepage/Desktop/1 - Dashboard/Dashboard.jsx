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
            <span id="date">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="dashboard-welcome">
          <h1>HABBITLY</h1>
          <p>
            Welcome back,
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
    </section>
  );
};
