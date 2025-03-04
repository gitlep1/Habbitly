import "./Homepage.scss";
import { useState, useEffect, useRef, useContext } from "react";
import {
  screenVersionContext,
  themeContext,
} from "../../CustomContexts/Contexts";

import { Desktop } from "./Desktop/Desktop";
import { Mobile } from "./Mobile/Mobile";

export const Homepage = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);

  return (
    <section
      className={`
      ${screenVersion}-homepage 
      ${themeState === "dark" ? "dark" : "light"}
      `}
    >
      {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
    </section>
  );
};
