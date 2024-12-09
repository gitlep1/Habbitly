import "./Homepage.scss";
import { useState, useEffect, useRef, useContext } from "react";
import {
  screenVersionContext,
  themeContext,
} from "../../CustomContexts/Contexts";

const Homepage = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState } = useContext(themeContext);

  return (
    <section
      className={`
      ${screenVersion}-homepage 
      ${themeState === "dark" ? "dark" : "light"}
      `}
    >
      <div className={`${screenVersion}-homepage-content`}>
        <h1>Homepage</h1>
      </div>
    </section>
  );
};

export default Homepage;
