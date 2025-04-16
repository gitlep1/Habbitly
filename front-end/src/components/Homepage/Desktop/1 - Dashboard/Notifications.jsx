import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

import {
  GetCookies,
  SetCookies,
} from "../../../../CustomFunctions/HandleCookies";

import harrold from "../../../../assets/images/Dashboard-images/Harrold.png";

export const Notifications = ({}) => {
  return (
    <div className="notifications-container">
      <div className="notifications-card">
        <div className="notifications-card-header">
          <Image
            src={harrold}
            alt="harrold-notifications-card"
            id="notifications-cloud"
          />
          <h3>Notifications</h3>
        </div>
      </div>
    </div>
  );
};
