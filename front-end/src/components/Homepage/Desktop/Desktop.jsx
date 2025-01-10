import "./Desktop.scss";
import { useContext } from "react";

import { themeContext } from "../../../CustomContexts/Contexts";

export const Desktop = () => {
  const { themeState } = useContext(themeContext);

  return (
    <>
      <div>Desktop Homepage</div>
    </>
  );
};
