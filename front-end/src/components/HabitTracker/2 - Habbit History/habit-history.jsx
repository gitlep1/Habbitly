import "./habit-history.scss";
import { useEffect, useState } from "react";
import { Image, Table } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import axios from "axios";

import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import maxwell from "../../../assets/images/habit-tracker-images/Maxwell.png";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const HabitHistory = () => {
  const tokenData = GetCookies("authToken") || null;
  const themeState = GetCookies("theme") || "dark";
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getUsersHabitHistory();
  }, [tokenData]); // eslint-disable-line

  const getUsersHabitHistory = async () => {
    await axios
      .get(`${API}/history/user`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then((res) => {
        setHistory(res.data.payload);
      })
      .catch((err) => {
        console.error(err?.response?.data?.error);
      });
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case "added":
        return "text-success";
      case "updated":
        return "text-info";
      case "deleted":
        return "text-danger";
      default:
        return "";
    }
  };

  return (
    <div className="habit-history-container min-h-screen min-w-screen">
      <div className="max-w-7xl mx-auto mt-[10em] md:mt-0">
        <div className="flex items-center justify-center text-3xl font-bold mb-6">
          <h1>Habit History</h1>
          <Image
            src={maxwell}
            alt="Maxwell"
            className="maxwell-image w-[100px]"
          />
        </div>

        {history.length > 0 ? (
          <>
            {/* // === DESKTOP/TABLET TABLE VIEW === \\ */}
            <div className="d-none d-md-block pr-4 pl-4">
              <Table
                striped
                bordered
                hover
                variant={themeState === "dark" ? "dark" : "light"}
                responsive="sm"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>History ID</th>
                    <th>Habit ID</th>
                    <th>Habit Name</th>
                    <th>Action</th>
                    <th>Full Habit Completion</th>
                    <th>History Logged At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "100px" }}
                      >
                        <span
                          data-tooltip-id={`history-tooltip-${index}`}
                          data-tooltip-content={entry.id}
                          style={{ cursor: "default" }}
                        >
                          {entry.id.slice(0, 6)}...
                        </span>
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        <span
                          data-tooltip-id={`history-tooltip-${index}`}
                          data-tooltip-content={entry.habit_id}
                          style={{ cursor: "default" }}
                        >
                          {entry.habit_id.slice(0, 6)}...
                        </span>
                      </td>

                      <td className="text-wrap">{entry.habit_name}</td>
                      <td className={`fw-bold ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </td>
                      <td>
                        {entry.has_reached_end_date
                          ? "Yes"
                          : "Habit not fully completed yet"}
                      </td>
                      <td style={{ minWidth: "150px" }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {history.map((entry, index) => (
                <div key={`tooltip-fragment-${index}`}>
                  <Tooltip id={`history-tooltip-${index}`} delayShow={1500} />
                  <Tooltip id={`habit-tooltip-${index}`} delayShow={1500} />
                </div>
              ))}
            </div>

            {/* // === MOBILE STACKED CARD VIEW === \\ */}
            <div className="d-block d-md-none pr-4 pl-4">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`${
                    themeState === "dark"
                      ? "bg-dark text-white"
                      : "bg-light text-black"
                  } p-3 rounded mb-3 shadow-sm border border-secondary`}
                >
                  <div className="mb-2">
                    <strong>#{index + 1}</strong>
                  </div>
                  <div>
                    <strong>History ID:</strong> {entry.id}
                  </div>
                  <div>
                    <strong>Habit ID:</strong> {entry.habit_id}
                  </div>
                  <div>
                    <strong>Habit Name:</strong> {entry.habit_name}
                  </div>
                  <div>
                    <strong>Action:</strong>{" "}
                    <span className={getActionColor(entry.action)}>
                      {entry.action}
                    </span>
                  </div>
                  <div>
                    <strong>Habit Completed:</strong>{" "}
                    {entry.has_reached_end_date ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Entry Logged At:</strong>{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="flex justify-center">
            No history data found, create a habit.
          </p>
        )}
      </div>
    </div>
  );
};
