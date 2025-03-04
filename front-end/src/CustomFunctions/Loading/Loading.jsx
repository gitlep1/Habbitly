import "./Loading.scss";
import { useState } from "react";

export const Loading = ({ data }) => {
  const [loading, setLoading] = useState(true);

  return (
    <section className="loading-container">
      <div className="loading-spinner"></div>
    </section>
  );
};
