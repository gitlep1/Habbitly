import "./Desktop.scss";
import { useContext } from "react";

import { themeContext } from "../../../CustomContexts/Contexts";

export const Desktop = () => {
  const { themeState } = useContext(themeContext);

  return (
    <section className="desktop-homepage-container">
      <div className="desktop-homepage-inner">Desktop Homepage</div>
    </section>
  );
};
