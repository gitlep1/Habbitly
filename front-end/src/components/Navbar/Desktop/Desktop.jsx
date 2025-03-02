import "./Desktop.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";

import { themeContext } from "../../../CustomContexts/Contexts";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

export default function Desktop() {
  const navigate = useNavigate();
  const { themeState, setThemeState } = useContext(themeContext);

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState([]);

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

  const handleButtonToggle = (e) => {
    const name = e.target.dataset.name;

    if (showDropdown.includes(name)) {
      setShowDropdown(showDropdown.filter((item) => item !== name));
    } else {
      setShowDropdown([...showDropdown, name]);
    }
  };

  const slideDropdownAnimation = useSpring({});

  return (
    <>
      <div className="desktop-navbar-title-container">
        <Image src={StellyHappy} className="desktop-navbar-logo" />
        <div className="desktop-navbar-title">
          <h1>Habbitly</h1>

          <div className="nav-theme-switcher-container">
            <div
              className={`nav-theme-switcher-outer-box ${
                themeState === "dark"
                  ? "theme-switcher-dark"
                  : "theme-switcher-light"
              }`}
              style={
                themeState === "dark"
                  ? { border: "1px solid whitesmoke" }
                  : { border: "1px solid black" }
              }
              onClick={() => {
                setThemeState(themeState === "dark" ? "light" : "dark");
              }}
            >
              <div
                className="nav-theme-switcher-inner-box"
                style={
                  themeState === "dark"
                    ? { backgroundColor: "whitesmoke" }
                    : { backgroundColor: "black" }
                }
              ></div>

              <FaMoon id="nav-dark-logo" />
              <IoIosSunny id="nav-light-logo" />
            </div>
          </div>
        </div>

        <Image src={StellyAngry} className="desktop-navbar-logo" />
      </div>

      <div className="desktop-navbar-links">
        <div className="desktop-navbar-link-container">
          <h3 data-name="homepage" onClick={handleButtonToggle}>
            <span>
              {showDropdown.includes("homepage") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
            Homepage
            <span>
              {showDropdown.includes("homepage") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
          </h3>
          <hr />
          <br />

          {showDropdown.includes("homepage") && (
            <animated.div className="desktop-navbar-button-container">
              <Button
                id="desktop-navbar-dashboard-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/");
                }}
              >
                Dashboard
              </Button>

              <Button
                id="desktop-navbar-summary-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/summary");
                }}
              >
                Daily Summary
              </Button>

              <Button
                id="desktop-navbar-insight-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/insights");
                }}
              >
                Insights & Analytics
              </Button>
            </animated.div>
          )}
        </div>

        <div className="desktop-navbar-link-container">
          <h3 data-name="habitTracker" onClick={handleButtonToggle}>
            <span>
              {showDropdown.includes("habitTracker") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
            Habit Tracker
            <span>
              {showDropdown.includes("habitTracker") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
          </h3>
          <hr />
          <br />

          {showDropdown.includes("habitTracker") && (
            <animated.div className="desktop-navbar-button-container">
              <Button
                id="desktop-navbar-habit-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/habit-tracker");
                }}
              >
                Habits
              </Button>

              <Button
                id="desktop-navbar-create-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
              >
                Create New Habit
              </Button>

              <Button
                id="desktop-navbar-history-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/habit-history");
                }}
              >
                Habit History
              </Button>
            </animated.div>
          )}
        </div>

        <div className="desktop-navbar-link-container">
          <h3 data-name="accountSettings" onClick={handleButtonToggle}>
            <span>
              {showDropdown.includes("accountSettings") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
            Account Settings
            <span>
              {showDropdown.includes("accountSettings") ? (
                <FaLongArrowAltDown />
              ) : (
                <FaLongArrowAltUp />
              )}
            </span>
          </h3>
          <hr />
          <br />

          {showDropdown.includes("accountSettings") && (
            <animated.div className="desktop-navbar-button-container">
              <Button
                id="desktop-navbar-profile-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/");
                }}
              >
                Profile
              </Button>

              <Button
                id="desktop-navbar-notifications-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/summary");
                }}
              >
                Notifications
              </Button>

              <Button
                id="desktop-navbar-preferences-button"
                className={`desktop-navbar-button ${
                  themeState === "dark" ? "dark-button" : "light-button"
                }`}
                onClick={() => {
                  navigate("/insights");
                }}
              >
                Preferences
              </Button>
            </animated.div>
          )}
        </div>
      </div>

      <div className="navbar-auth-buttons">
        <Button
          id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
          className="signin-button"
          variant="success"
          onClick={() => {
            handleShow("signin");
          }}
        >
          Sign In
        </Button>
        <Button
          id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
          className="signup-button"
          onClick={() => {
            handleShow("signup");
          }}
        >
          Sign Up
        </Button>
      </div>

      {renderSignInModal()}
      {renderSignUpModal()}
    </>
  );
}
