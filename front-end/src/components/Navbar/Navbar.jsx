import { useState, useContext } from "react";
import { useSpring, animated } from "react-spring";

import {
  screenVersionContext,
  themeContext,
} from "../../CustomContexts/Contexts";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

export const Navbar = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState, setThemeState } = useContext(themeContext);

  return (
    <nav className="main-navbar">
      <themeContext.Provider value={{ themeState, setThemeState }}>
        {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
      </themeContext.Provider>
    </nav>
  );
};
