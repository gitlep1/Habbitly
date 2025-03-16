import "./Homepage.scss";
import { useContext } from "react";
import { screenVersionContext } from "../../CustomContexts/Contexts";

import { Desktop } from "./Desktop/Desktop";
import { Mobile } from "./Mobile/Mobile";

export const Homepage = () => {
  const screenVersion = useContext(screenVersionContext);

  return screenVersion === "desktop" ? <Desktop /> : <Mobile />;
};
