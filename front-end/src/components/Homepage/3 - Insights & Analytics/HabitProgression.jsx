import { useContext, useEffect, useState } from "react";
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
import { themeContext } from "../../../CustomContexts/Contexts";
import { AggregateLogDates } from "./HandleLogDates";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const HabitProgression = ({ userHabits }) => {
  const { themeState } = useContext(themeContext);

  const [view] = useState("weekly");
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const { labels, data } = AggregateLogDates(userHabits, view);
    setChartData({ labels, data });
  }, [userHabits, view]);

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

  const getSuggestedMax = (data) => {
    const max = Math.max(...data);
    if (max <= 5) return 5;
    if (max <= 10) return 10;
    if (max <= 15) return 15;
    if (max <= 20) return 20;
    if (max <= 25) return 25;
    if (max <= 50) return 50;
    if (max <= 75) return 75;
    return 100;
  };

  const getStepSize = (max) => {
    if (max <= 5) return 5;
    if (max <= 10) return 5;
    if (max <= 25) return 5;
    if (max <= 50) return 10;
    if (max <= 100) return 25;
    return 50;
  };

  const habitProgressData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Habit Progression",
        data: chartData.data,
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
        beginAtZero: true,
        ticks: {
          stepSize: getStepSize(getSuggestedMax(chartData.data)),
          callback: (value) => (value >= 100 ? "100+" : value),
          color: tickLabelColor,
          font: {
            size: 14,
            weight: "bold",
          },
        },
        suggestedMax: getSuggestedMax(chartData.data),
        grid: {
          display: true,
          color: gridLineColor,
          drawBorder: false,
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

  if (!userHabits || userHabits.length === 0) {
    return (
      <div className="p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Habit Progression</h2>
        <p className={themeState === "dark" ? "text-white" : "text-black"}>
          No habits to display yet. Add some!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Habit Progression</h2>
      <div className="h-48 w-full">
        <Line data={habitProgressData} options={habitProgressOptions} />
      </div>
    </div>
  );
};
