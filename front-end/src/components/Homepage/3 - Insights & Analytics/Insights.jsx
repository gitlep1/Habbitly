import "./Insights.scss";
import { useContext, useState } from "react";
import { Image } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { themeContext, habitContext } from "../../../CustomContexts/Contexts";

import anthony from "../../../assets/images/insights-images/Anthony.png";

import { Loading } from "../../../CustomFunctions/Loading/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const Insights = () => {
  const { themeState } = useContext(themeContext);
  const { userHabits } = useContext(habitContext);

  const [isLoading, setIsLoading] = useState(false);

  const lineColor =
    themeState === "light" ? "rgb(204, 136, 0)" : "rgb(255, 165, 0)";
  const pointColor = lineColor;

  const gridLineColor =
    themeState === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const tickLabelColor =
    themeState === "light" ? "rgb(50, 50, 50)" : "rgb(150, 150, 150)";
  const tooltipBgColor =
    themeState === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.7)";
  const tooltipTextColor = themeState === "light" ? "#333" : "#fff";
  const tooltipBorderColor =
    themeState === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)";

  const habitProgressData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Progress",
        data: [10, 25, 20, 35, 30, 45, 50],
        fill: false,
        borderColor: lineColor,
        backgroundColor: pointColor,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: pointColor,
        pointBorderColor: pointColor,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: pointColor,
        pointHoverBorderColor: pointColor,
      },
    ],
  };

  const habitProgressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: tooltipBgColor,
        titleColor: tooltipTextColor,
        bodyColor: tooltipTextColor,
        borderColor: tooltipBorderColor,
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: gridLineColor,
        },
        ticks: {
          color: tickLabelColor,
          font: {
            size: 14,
            weight: "bold",
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: gridLineColor,
          drawBorder: false,
        },
        ticks: {
          display: true,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <section className="insights-container p-4 md:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto mt-[7em] md:mt-0">
        <div className="flex flex-col sm:flex-row items-center justify-center space-x-4 mb-6">
          <Image
            src={anthony}
            alt="Anthony"
            className="anthony object-contain"
          />

          <div>
            <h1 className="text-4xl font-bold">Insights & Analytics</h1>
            <p className="text-gray-500 text-lg">
              Your habit statistics and trends
            </p>
          </div>
        </div>

        <div className="insights-content grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Habit Progress</h2>
            <div className="h-48 w-full">
              <Line data={habitProgressData} options={habitProgressOptions} />
            </div>
          </div>

          <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Time Spent</h2>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                615
              </div>
              <div className="w-full h-full rounded-full border-[10px] border-orange-400 border-t-blue-700"></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Habit Distribution</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Exercise</span>
                <div className="w-1/2 h-3 bg-blue-700 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span>Mindfulness</span>
                <div className="w-1/2 h-3 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span>Reading</span>
                <div className="w-1/2 h-3 bg-orange-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Completion Rate</h2>
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                82%
              </div>
              <div className="w-full h-full rounded-full border-[8px] border-green-400 border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
