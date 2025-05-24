import "./Summary.scss";
import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Button } from "@mui/material";
import axios from "axios";

import Sunny from "../../../assets/images/summary-images/Sunny.png";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Summary = () => {
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
        <div className="summary-box task-completed-box bg-dark-blue p-6 rounded-xl shadow-md w-[250px] text-center">
          <h3>
            Tasks <br /> completed
          </h3>
          <h2 className="text-3xl font-bold">4 / 5</h2>
        </div>

        <div className="summary-box today-habits-box bg-dark-blue p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Today&apos;s Habits</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Mindfulness</li>
            <li>Exercise</li>
            <li>Read</li>
          </ul>
        </div>

        <div className="summary-box streak-box bg-orange-gradient p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Streak</h3>
          <p className="text-4xl font-bold mt-1">8 days</p>
        </div>

        <div className="summary-box time-spent-box bg-dark-blue p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Time Spent</h3>
          <p className="text-3xl font-bold mt-1">2h 10m</p>
        </div>

        <div className="summary-box progress-box bg-dark-blue p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Progress</h3>
          <p className="mt-1">Better than yesterday</p>
        </div>
      </div>
    </section>
  );
};
