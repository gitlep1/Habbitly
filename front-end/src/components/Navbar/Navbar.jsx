import "./Navbar.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useSpring, animated } from "react-spring";

import { screenVersionContext } from "../../Contexts";

import StellyHappy from "../../assets/images/StellyHappy.png";
import StellyAngry from "../../assets/images/StellyAngry.png";

const Navbar = () => {
  const navigate = useNavigate();
  const screenVersion = useContext(screenVersionContext);
  const [expanded, setExpanded] = useState(true);

  const expandNavbarAnimation = useSpring({
    height: expanded ? "7em" : "0",
    opacity: expanded ? 1 : 0,
    config: {
      duration: 500,
    },
  });

  const renderDesktopNavbar = () => {
    return (
      <>
        <div className={`${screenVersion}-navbar-title`}>
          <Image src={StellyHappy} className={`${screenVersion}-navbar-logo`} />
          <p>Habbitly</p>
          <Image src={StellyAngry} className={`${screenVersion}-navbar-logo`} />
        </div>

        <Button
          className={`${screenVersion}-expanded-button`}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <span id="line1"></span>
          <span id="line2"></span>
          <span id="line3"></span>
        </Button>

        <animated.div
          className={`${screenVersion}-navbar-links`}
          style={expandNavbarAnimation}
        >
          <div className={`${screenVersion}-homepage-button`}>Homepage</div>

          <div className={`${screenVersion}-habit-page-button`}>
            Habits/Goals
          </div>

          <div className={`${screenVersion}-account-page-button`}>
            Account Settings
          </div>

          <div className={`${screenVersion}-navbar-auth-buttons`}>
            <Button className={`${screenVersion}-signin-button`}>Login</Button>

            <Button className={`${screenVersion}-signup-button`}>
              Sign Up
            </Button>
          </div>
        </animated.div>
      </>
    );
  };

  const renderMobileNavbar = () => {
    return (
      <>
        <div className={`${screenVersion}-navbar-title`}>
          <Image src={StellyHappy} className={`${screenVersion}-navbar-logo`} />
          <p>Habbitly</p>
          <Image src={StellyAngry} className={`${screenVersion}-navbar-logo`} />
        </div>

        <Button
          className={`${screenVersion}-expanded-button`}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <span id="line1"></span>
          <span id="line2"></span>
          <span id="line3"></span>
        </Button>

        <animated.div
          className={`${screenVersion}-navbar-links`}
          style={expandNavbarAnimation}
        >
          <div className={`${screenVersion}-homepage-button`}>Homepage</div>

          <div className={`${screenVersion}-habit-page-button`}>
            Habits/Goals
          </div>

          <div className={`${screenVersion}-account-page-button`}>
            Account Settings
          </div>

          <div className={`${screenVersion}-navbar-auth-buttons`}>
            <Button className={`${screenVersion}-signin-button`}>Login</Button>

            <Button className={`${screenVersion}-signup-button`}>
              Sign Up
            </Button>
          </div>
        </animated.div>
      </>
    );
  };

  return (
    <nav id={`${screenVersion}-navbar`}>
      {screenVersion === "desktop"
        ? renderDesktopNavbar()
        : renderMobileNavbar()}
    </nav>
  );
};

export default Navbar;
