import "./Navbar.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";

import {
  screenVersionContext,
  themeContext,
} from "../../CustomContexts/Contexts";

import StellyHappy from "../../assets/images/StellyHappy.png";
import StellyAngry from "../../assets/images/StellyAngry.png";

const Navbar = () => {
  const navigate = useNavigate();
  const screenVersion = useContext(screenVersionContext);
  const { themeState, setThemeState } = useContext(themeContext);

  const [expanded, setExpanded] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleShow = (auth) => {
    if (auth === "signin") {
      setShowSignInModal(true);
      setShowSignUpModal(false);
    } else {
      setShowSignInModal(false);
      setShowSignUpModal(true);
    }
  };

  const handleClose = () => {
    if (showSignInModal) {
      setShowSignInModal(false);
      setShowSignUpModal(false);
    } else if (showSignUpModal) {
      setShowSignUpModal(false);
      setShowSignInModal(false);
    }
  };

  const expandNavbarAnimation = useSpring({
    height: expanded ? "8em" : "0",
    opacity: expanded ? 1 : 0,
    zIndex: expanded ? 1 : -1,
    config: {
      duration: 500,
    },
  });

  const renderMobileNavbar = () => {
    return (
      <>
        <div className={`${screenVersion}-navbar-title`}>
          <Image
            src={StellyHappy}
            className={`${screenVersion}-navbar-logo`}
            onClick={() => {
              setThemeState("light");
            }}
          />
          <p>Habbitly</p>
          <Image
            src={StellyAngry}
            className={`${screenVersion}-navbar-logo`}
            onClick={() => {
              setThemeState("dark");
            }}
          />
        </div>

        <Button
          variant="none"
          className={`${screenVersion}-expanded-button`}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <span
            className={`${themeState === "dark" ? "darkmode" : "lightmode"}`}
          >
            {expanded ? "Hide Menu" : "Show Menu"}
          </span>
        </Button>

        <animated.div
          className={`${screenVersion}-navbar-links`}
          style={expandNavbarAnimation}
        >
          <div
            className={`${screenVersion}-homepage-button`}
            onClick={() => {
              navigate("/");
            }}
          >
            Homepage
          </div>

          <div
            className={`${screenVersion}-habit-page-button`}
            onClick={() => {
              navigate("/Habbits");
            }}
          >
            Habbits/Goals
          </div>

          <div
            className={`${screenVersion}-account-page-button`}
            onClick={() => {
              navigate("/Account-Settings");
            }}
          >
            Account Settings
          </div>

          <div className="navbar-auth-buttons">
            <Button
              className="signin-button"
              onClick={() => {
                handleShow("signin");
              }}
            >
              SignIn
            </Button>
            <Button
              className="signup-button"
              onClick={() => {
                handleShow("signup");
              }}
            >
              SignUp
            </Button>
          </div>

          {renderSignInModal()}
          {renderSignUpModal()}
        </animated.div>
      </>
    );
  };

  const renderDesktopNavbar = () => {
    return (
      <>
        <div className={`${screenVersion}-navbar-title`}>
          <Image
            src={StellyHappy}
            className={`${screenVersion}-navbar-logo`}
            onClick={() => {
              setThemeState("light");
            }}
          />
          <p>Habbitly</p>
          <Image
            src={StellyAngry}
            className={`${screenVersion}-navbar-logo`}
            onClick={() => {
              setThemeState("dark");
            }}
          />
        </div>

        <div
          className={`${screenVersion}-navbar-links`}
          style={expandNavbarAnimation}
        >
          <div
            className={`${screenVersion}-homepage-button`}
            onClick={() => {
              navigate("/");
            }}
          >
            Homepage
          </div>

          <div
            className={`${screenVersion}-habit-page-button`}
            onClick={() => {
              navigate("/Habbits");
            }}
          >
            Habits/Goals
          </div>

          <div
            className={`${screenVersion}-account-page-button`}
            onClick={() => {
              navigate("/Account-Settings");
            }}
          >
            Account Settings
          </div>

          <div className="navbar-auth-buttons">
            <Button
              className="signin-button"
              onClick={() => {
                handleShow("signin");
              }}
            >
              SignIn
            </Button>
            <Button
              className="signup-button"
              onClick={() => {
                handleShow("signup");
              }}
            >
              SignUp
            </Button>
          </div>

          {renderSignInModal()}
          {renderSignUpModal()}
        </div>
      </>
    );
  };

  const renderSignInModal = () => {
    return (
      <Modal
        show={showSignInModal}
        onHide={handleClose}
        className="navbar-signin-modal"
      >
        <Modal.Header closeButton className="navbar-signin-modal-header">
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-signin-modal-body">
          <p>Sign In</p>
        </Modal.Body>
        <Modal.Footer className="navbar-signin-modal-footer">
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success">Sign In</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderSignUpModal = () => {
    return (
      <Modal
        show={showSignUpModal}
        onHide={handleClose}
        className="navbar-signup-modal"
      >
        <Modal.Header closeButton className="navbar-signup-modal-header">
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-signup-modal-body">
          <p>Sign Up</p>
        </Modal.Body>
        <Modal.Footer className="navbar-signup-modal-footer">
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success">Sign Up</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <nav
      className={`${screenVersion}-navbar ${
        themeState === "dark" ? "darkmode" : "lightmode"
      }`}
    >
      <themeContext.Provider value={themeState}>
        {screenVersion === "desktop"
          ? renderDesktopNavbar()
          : renderMobileNavbar()}
      </themeContext.Provider>
    </nav>
  );
};

export default Navbar;
