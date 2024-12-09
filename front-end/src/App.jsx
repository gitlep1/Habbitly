import "./app.scss";
import { useState, useEffect, useContext } from "react";
// import * as THREE from "three"; add animated 3D cloud background later
import { screenVersionContext, themeContext } from "./CustomContexts/Contexts";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

const App = () => {
  const { screenVersion } = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);

  return (
    <section
      className={`App ${themeState === "dark" ? "darkmode" : "lightmode"}`}
    >
      {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
    </section>
  );
};

export default App;

/** 
cookie stuff (taken from my chess project):
  // === imports === \\
  import Cookies from "js-cookie";
  import { setCookies, removeCookies } from "../CustomFunctions/HandleCookies";

  // === variables === \\
    const userData = Cookies.get("Current_User") || null;
    const tokenData = Cookies.get("token") || null;

  // === check cookies func === //
    const checkCookies = async () => {
      if (userData && tokenData) {
        setUser(JSON.parse(userData));
        setToken(JSON.parse(tokenData));
      }
      setMainLoading(false);
    };

  // === exp date === \\
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

  // === set cookies example === \\
    SetCookies("Current_User", user.payload, expirationDate);
    SetCookies("token", user.token, expirationDate);
*/
