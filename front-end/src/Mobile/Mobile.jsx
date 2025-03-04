import "./Mobile.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext } from "../CustomContexts/Contexts";

import { Notfound } from "../components/Notfound/Notfound";
import { Navbar } from "../components/Navbar/Navbar";
import { Homepage } from "../components/Homepage/Homepage";

const Mobile = () => {
  const screenVersion = useContext(screenVersionContext);

  return (
    <section className={screenVersion}>
      <Navbar />

      <Routes>
        <Route path="/">
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </section>
  );
};

export default Mobile;
