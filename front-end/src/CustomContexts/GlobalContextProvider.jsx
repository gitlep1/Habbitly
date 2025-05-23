import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import {
  screenVersionContext,
  themeContext,
  userContext,
  habitContext,
  errorContext,
} from "./Contexts";
import DetectScreenSize from "../CustomFunctions/DetectScreenSize";

import { GetCookies } from "../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

const GlobalContextProvider = ({ children }) => {
  const [screenVersion, setScreenVersion] = useState("desktop");
  const [themeState, setThemeState] = useState(GetCookies("theme") || "dark");
  const [authUser, setAuthUser] = useState(GetCookies("authUser") || null);
  const [userHabits, setUserHabits] = useState([]);
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

  const getUserHabits = async () => {
    const userData = GetCookies("authUser");
    const tokenData = GetCookies("authToken");
    console.log("userData: ", userData);
    console.log("tokenData: ", tokenData);

    const res = await axios.get(`${API}/habbits/user`, {
      withCredentials: true,
    });
    setUserHabits(res.data.payload);
  };

  return (
    <screenVersionContext.Provider value={screenVersion}>
      <userContext.Provider value={{ authUser, setAuthUser }}>
        <themeContext.Provider value={{ themeState, setThemeState }}>
          <habitContext.Provider value={{ userHabits, getUserHabits }}>
            <errorContext.Provider value={{ error, setError }}>
              {children}
            </errorContext.Provider>
          </habitContext.Provider>
        </themeContext.Provider>
      </userContext.Provider>
    </screenVersionContext.Provider>
  );
};

GlobalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalContextProvider;
