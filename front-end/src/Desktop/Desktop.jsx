import "./Desktop.scss";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext } from "../CustomContexts/Contexts";

import { Notfound } from "../components/Notfound/Notfound";
import { Navbar } from "../components/Navbar/Navbar";
import { EmailVerification } from "../components/AccountSettings/EmailVerification";

import { Dashboard } from "../components/Homepage/Desktop/1 - Dashboard/Dashboard";
import { Summary } from "../components/Homepage/Desktop/2 - DailySummary/Summary";
import { Insights } from "../components/Homepage/Desktop/3 - Insights & Analytics/Insights";

const Desktop = () => {
  const screenVersion = useContext(screenVersionContext);

  return (
    <section className={screenVersion}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/homepage/summary" element={<Summary />} />
        <Route path="/homepage/insights" element={<Insights />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </section>
  );
};

export default Desktop;
