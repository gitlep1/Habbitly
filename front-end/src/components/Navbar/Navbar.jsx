import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";

import StellyHappy from "../../../public/images/StellyHappy.png";
import StellyAngry from "../../../public/images/StellyAngry.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav id="navbar">
      <div className="navbar-title">
        <Image src={StellyHappy} id="navbar-logo" />
        <p>Habbitly</p>
        <Image src={StellyAngry} id="navbar-logo" />
      </div>

      <div className="navbar-links">
        <div className="homepage-button">Homepage</div>

        <div className="habit-page-button">Habits/Goals</div>

        <div className="account-page-button">Account Settings</div>
      </div>

      <div className="navbar-auth-buttons">
        <Button className="signin-button">Login</Button>

        <Button className="signup-button">Sign Up</Button>
      </div>
    </nav>
  );
};

export default Navbar;
