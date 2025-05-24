import "./app.scss";
import { useState, useEffect, useContext } from "react";

import {
  screenVersionContext,
  themeContext,
  userContext,
  preferencesContext,
} from "./CustomContexts/Contexts";
import CustomToastContainers from "./CustomFunctions/CustomToasts/CustomToastContainers";
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";
import SmallResolution from "./CustomFunctions/SmallResolution/SmallResolution";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

import CloudsBackground from "./components/3D-Background/CloudsBackground";

const App = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);
  const { preferences } = useContext(preferencesContext);

  const [screenSize, setScreenSize] = useState(DetectScreenSize().width);

  useEffect(() => {
    const resizeSidebarInterval = setInterval(() => {
      setScreenSize(DetectScreenSize().width);
    }, 500);

    return () => {
      clearInterval(resizeSidebarInterval);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(DetectScreenSize().width);
    };

    document.body.className =
      themeState === "dark" ? "dark-theme" : "light-theme";

    const resizeSidebarInterval = setInterval(checkScreenSize, 500);

    return () => {
      clearInterval(resizeSidebarInterval);
    };
  }, [themeState]);

  const allowAnimatedBackground = preferences?.animatedBackground;

  return (
    <section
      className={`App ${themeState === "dark" ? "darkmode" : "lightmode"}`}
    >
      {allowAnimatedBackground && <CloudsBackground />}
      <CustomToastContainers />
      {screenSize < 400 && <SmallResolution />}
      {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
    </section>
  );
};

export default App;
