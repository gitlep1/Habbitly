import "./Desktop.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext } from "../CustomContexts/Contexts";

import Navbar from "../components/Navbar/Navbar";
import Homepage from "../components/Homepage/Homepage";

const Desktop = () => {
  const screenVersion = useContext(screenVersionContext);

  return (
    <section className={screenVersion}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<h1>404 NOT FOUND</h1>} />
      </Routes>
    </section>
  );
};

export default Desktop;
