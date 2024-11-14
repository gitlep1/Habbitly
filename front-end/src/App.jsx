import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";

import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <section className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Navbar />}></Route>
        </Route>
      </Routes>
    </section>
  );
};

export default App;
