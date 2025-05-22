import "./Desktop.scss";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext, userContext } from "../CustomContexts/Contexts";

import { Notfound } from "../components/Notfound/Notfound";
import { Navbar } from "../components/Navbar/Navbar";
import { EmailVerification } from "../components/AccountSettings/EmailVerification";

import { Landing } from "../components/Landing/Landing";
import { Dashboard } from "../components/Homepage/Desktop/1 - Dashboard/Dashboard";
import { Summary } from "../components/Homepage/Desktop/2 - DailySummary/Summary";
import { Insights } from "../components/Homepage/Desktop/3 - Insights & Analytics/Insights";
import { Habits } from "../components/HabitTracker/1 - Habits/habits";
import { HabitHistory } from "../components/HabitTracker/2 - Habbit History/habit-history";

const Desktop = () => {
  const screenVersion = useContext(screenVersionContext);
  const { authUser } = useContext(userContext);

  return (
    <section className={screenVersion}>
      {!authUser ? null : <Navbar />}

      <Routes>
        {!authUser ? (
          <Route path="/" element={<Landing />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/habit-tracker" element={<Habits />} />
            <Route path="/habit-history" element={<HabitHistory />} />
          </>
        )}
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </section>
  );
};

export default Desktop;
