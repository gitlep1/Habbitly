import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import maxwell from "../../../../assets/images/Dashboard-images/Maxwell.png";

export const Calendar = ({}) => {
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
      </div>
    </div>
  );
};
