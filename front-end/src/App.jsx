import "./app.scss";
import { useState, useEffect, useContext } from "react";
// import * as THREE from "three";
import Cookies from "js-cookie";

import {
  screenVersionContext,
  themeContext,
  userContext,
  tokenContext,
} from "./CustomContexts/Contexts";
import CustomToastContainers from "./CustomFunctions/CustomToasts/CustomToastContainers";
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";
import SmallResolution from "./CustomFunctions/SmallResolution/SmallResolution";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

const App = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);
  const { setAuthUser } = useContext(userContext);
  const { setAuthToken } = useContext(tokenContext);

  const userData = Cookies.get("authUser") || null;
  const tokenData = Cookies.get("authToken") || null;

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
    handleReauthUser();
  }, []); // eslint-disable-line

  const handleReauthUser = () => {
    if (
      userData !== "undefined" &&
      userData !== null &&
      tokenData !== "undefined" &&
      tokenData !== null
    ) {
      setAuthUser(JSON.parse(userData));
      setAuthToken(JSON.parse(tokenData));
    } else {
      setAuthUser(null);
      setAuthToken(null);
    }
  };

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
