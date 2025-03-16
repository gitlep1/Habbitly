import "./Mobile.scss";
import { useContext } from "react";

import { themeContext } from "../../../CustomContexts/Contexts";

export const Mobile = () => {
  const { themeState } = useContext(themeContext);

  return (
    <section className="mobile-homepage">
      <div>Mobile Homepage</div>
    </section>
  );
};
