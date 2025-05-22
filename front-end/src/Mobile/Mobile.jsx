import "./Mobile.scss";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext, userContext } from "../CustomContexts/Contexts";

import { Notfound } from "../components/Notfound/Notfound";
import { Navbar } from "../components/Navbar/Navbar";
import { EmailVerification } from "../components/AccountSettings/EmailVerification";

import { Landing } from "../components/Landing/Landing";
// import { Dashboard } from "../components/Homepage/Mobile/1 - Dashboard/Dashboard";
// import { Summary } from "../components/Homepage/Mobile/2 - DailySummary/Summary";
// import { Insights } from "../components/Homepage/Mobile/3 - Insights & Analytics/Insights";

import { Dashboard } from "../components/Homepage/Desktop/1 - Dashboard/Dashboard";
import { Summary } from "../components/Homepage/Desktop/2 - DailySummary/Summary";
import { Insights } from "../components/Homepage/Desktop/3 - Insights & Analytics/Insights";

const Mobile = () => {
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
          </>
        )}
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </section>
  );
};

export default Mobile;
