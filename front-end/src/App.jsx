import "./app.scss";
import { useState, useEffect, useContext } from "react";
// import * as THREE from "three";

import {
  screenVersionContext,
  themeContext,
  userContext,
} from "./CustomContexts/Contexts";
import CustomToastContainers from "./CustomFunctions/CustomToasts/CustomToastContainers";
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";
import SmallResolution from "./CustomFunctions/SmallResolution/SmallResolution";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

const App = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);
  const { authUser } = useContext(userContext);

  const [screenSize, setScreenSize] = useState(DetectScreenSize().width);

  useEffect(() => {
    const resizeSidebarInterval = setInterval(() => {
      setScreenSize(DetectScreenSize().width);
    }, 500);

    return () => {
      clearInterval(resizeSidebarInterval);
    };
  }, []);

  return (
    <section
      className={`App ${themeState === "dark" ? "darkmode" : "lightmode"}`}
    >
      <CustomToastContainers />
      {screenSize < 400 && <SmallResolution />}
      {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
    </section>
  );
};

export default App;
