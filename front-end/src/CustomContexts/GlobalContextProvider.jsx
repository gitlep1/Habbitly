import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import {
  screenVersionContext,
  themeContext,
  userContext,
  habitContext,
  errorContext,
  preferencesContext,
} from "./Contexts";
import DetectScreenSize from "../CustomFunctions/DetectScreenSize";

import { GetCookies, SetCookies } from "../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

const defaultPreferences = {
  animatedBackground: true,
  uiSounds: false,
  showWelcomeTour: true,
  compactMode: false,
};

const GlobalContextProvider = ({ children }) => {
  const [screenVersion, setScreenVersion] = useState("desktop");
  const [themeState, setThemeState] = useState(GetCookies("theme") || "dark");
  const [authUser, setAuthUser] = useState(GetCookies("authUser") || null);
  const [userHabits, setUserHabits] = useState([]);
  const [error, setError] = useState("");

  const [preferences, setPreferences] = useState(() => {
    const userCookieData = GetCookies("preferences");
    if (userCookieData && typeof userCookieData === "object") {
      return { ...defaultPreferences, ...userCookieData };
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    SetCookies("preferences", defaultPreferences, expirationDate);
    return defaultPreferences;
  });

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

  const updateSitePreferences = useCallback((newPrefs) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    SetCookies("preferences", newPrefs, expirationDate);
    setPreferences(newPrefs);
  }, []);

  const getUserHabits = useCallback(async () => {
    const tokenData = GetCookies("authToken");

    await axios
      .get(`${API}/habbits/user`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${tokenData}`,
        },
      })
      .then((res) => {
        setUserHabits(res.data.payload);
      })
      .catch((err) => {
        setError(err?.response?.data?.error);
      });
  }, []);

  return (
    <screenVersionContext.Provider value={screenVersion}>
      <userContext.Provider value={{ authUser, setAuthUser }}>
        <themeContext.Provider value={{ themeState, setThemeState }}>
          <habitContext.Provider value={{ userHabits, getUserHabits }}>
            <errorContext.Provider value={{ error, setError }}>
              <preferencesContext.Provider
                value={{ preferences, updateSitePreferences }}
              >
                {children}
              </preferencesContext.Provider>
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
