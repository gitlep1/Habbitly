import "./Desktop.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { screenVersionContext } from "../Contexts";

import Navbar from "../components/Navbar/Navbar";

const Desktop = () => {
  const screenVersion = useContext(screenVersionContext);

  return (
    <section className={screenVersion}>
      <Routes>
        <Route path="/">
          <Route index element={<Navbar />} />
        </Route>
      </Routes>
    </section>
  );
};

export default Desktop;
