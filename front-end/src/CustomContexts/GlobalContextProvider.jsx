import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  screenVersionContext,
  themeContext,
  userContext,
  errorContext,
} from "./Contexts";
import DetectScreenSize from "../CustomFunctions/DetectScreenSize";

import { GetCookies } from "../CustomFunctions/HandleCookies";

const GlobalContextProvider = ({ children }) => {
  const [screenVersion, setScreenVersion] = useState("desktop");
  const [themeState, setThemeState] = useState(GetCookies("theme") || "dark");
  const [authUser, setAuthUser] = useState(GetCookies("authUser") || null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkScreenVersion = () => {
      const { width } = DetectScreenSize();
      setScreenVersion(width >= 768 ? "desktop" : "mobile");
    };

    checkScreenVersion();
    const intervalId = setInterval(checkScreenVersion, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <screenVersionContext.Provider value={screenVersion}>
      <userContext.Provider value={{ authUser, setAuthUser }}>
        <themeContext.Provider value={{ themeState, setThemeState }}>
          <errorContext.Provider value={{ error, setError }}>
            {children}
          </errorContext.Provider>
        </themeContext.Provider>
      </userContext.Provider>
    </screenVersionContext.Provider>
  );
};

GlobalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalContextProvider;
