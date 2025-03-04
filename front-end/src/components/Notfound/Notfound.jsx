import "./Notfound.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export const Notfound = () => {
  const navigate = useNavigate();

  return (
    <section className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Button onClick={() => navigate("/")}>Back to Homepage</Button>
      </div>
    </section>
  );
};
