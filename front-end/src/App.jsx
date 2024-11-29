import { useState, useEffect, createContext } from "react";
// import * as THREE from "three"; add animated 3D cloud background later
import "./app.scss";

import DetectScreenSize from "./CustomFunctions/DetectScreenSize";

import { screenVersionContext } from "./Contexts";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

const App = () => {
  const [screenVersion, setScreenVersion] = useState("desktop");

  useEffect(() => {
    const checkScreenVersion = setInterval(() => {
      if (DetectScreenSize().width >= 800) {
        setScreenVersion("desktop");
      } else {
        setScreenVersion("mobile");
      }
    }, 500);

    return () => {
      clearInterval(checkScreenVersion);
    };
  }, []);

  return (
    <section className="App">
      <screenVersionContext.Provider value={screenVersion}>
        {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
      </screenVersionContext.Provider>
    </section>
  );
};

export default App;
