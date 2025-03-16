import "./Desktop.scss";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext } from "../CustomContexts/Contexts";

import { Notfound } from "../components/Notfound/Notfound";
import { Navbar } from "../components/Navbar/Navbar";
import { Homepage } from "../components/Homepage/Homepage";
import { EmailVerification } from "../components/AccountSettings/EmailVerification";

const Desktop = () => {
  const screenVersion = useContext(screenVersionContext);

  return (
    <section className={screenVersion}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </section>
  );
};

export default Desktop;
