import "./Navbar.scss";
import { useContext } from "react";

import {
  screenVersionContext,
  themeContext,
} from "../../CustomContexts/Contexts";

import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

const Navbar = () => {
  const screenVersion = useContext(screenVersionContext);
  const { themeState, setThemeState } = useContext(themeContext);

  return (
    <nav
      className={`${screenVersion}-navbar ${
        themeState === "dark" ? "darkmode" : "lightmode"
      }`}
    >
      <themeContext.Provider value={{ themeState, setThemeState }}>
        {screenVersion === "desktop" ? <Desktop /> : <Mobile />}
      </themeContext.Provider>
    </nav>
  );
};

export default Navbar;
