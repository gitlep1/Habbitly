import "./Desktop.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";

import {
  themeContext,
  userContext,
  tokenContext,
} from "../../../CustomContexts/Contexts";
import {
  GetCookies,
  RemoveCookies,
} from "../../../CustomFunctions/HandleCookies";

import { Signup } from "../../AccountSettings/Signup";
import { Signin } from "../../AccountSettings/Signin";
import { Signout } from "../../AccountSettings/Signout";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

export default function Desktop() {
  const navigate = useNavigate();
  const { themeState, setThemeState } = useContext(themeContext);

  const userData = GetCookies("authUser");

  const [showDropdown, setShowDropdown] = useState([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [isSignin, setIsSignin] = useState(true);

  const handleAuthModalShow = () => {
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSignoutModalShow = () => {
    setShowSignoutModal(true);
  };

  const handleSignoutModalClose = () => {
    setShowSignoutModal(false);
  };

  const toggleForm = () => setIsSignin(!isSignin);

  const renderAuthModal = () => {
    return (
      <Modal
        show={showAuthModal}
        onHide={handleAuthModalClose}
        className="navbar-auth-modal"
      >
        <Modal.Header closeButton className="navbar-auth-modal-header">
          <Modal.Title>{isSignin ? "Sign In" : "Sign Up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-auth-modal-body">
          {isSignin ? (
            <Signin
              handleSignUpClick={toggleForm}
              handleAuthModalClose={handleAuthModalClose}
            />
          ) : (
            <Signup
              handleSignUpClick={toggleForm}
              handleAuthModalClose={handleAuthModalClose}
            />
          )}
        </Modal.Body>
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

  const slideDropdownHomepage = useSpring({
    opacity: showDropdown.includes("homepage") ? 1 : 0,
    transform: showDropdown.includes("homepage")
      ? "translateY(0%)"
      : "translateY(-50%)",
    config: { tension: 200, friction: 20 },
  });

  const slideDropdownHabitTracker = useSpring({
    opacity: showDropdown.includes("habitTracker") ? 1 : 0,
    transform: showDropdown.includes("habitTracker")
      ? "translateY(0%)"
      : "translateY(-50%)",
    config: { tension: 200, friction: 20 },
  });

  const slideDropdownAccountSettings = useSpring({
    opacity: showDropdown.includes("accountSettings") ? 1 : 0,
    transform: showDropdown.includes("accountSettings")
      ? "translateY(0%)"
      : "translateY(-50%)",
    config: { tension: 200, friction: 20 },
  });

  const arrowAnimationHomepage = useSpring({
    transform: showDropdown.includes("homepage")
      ? "rotate(180deg)"
      : "rotate(0deg)",
    config: { tension: 200, friction: 15 },
  });

  const arrowAnimationHabitTracker = useSpring({
    transform: showDropdown.includes("habitTracker")
      ? "rotate(180deg)"
      : "rotate(0deg)",
    config: { tension: 200, friction: 15 },
  });

  const arrowAnimationAccountSettings = useSpring({
    transform: showDropdown.includes("accountSettings")
      ? "rotate(180deg)"
      : "rotate(0deg)",
    config: { tension: 200, friction: 15 },
  });

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

      <div
        className={`desktop-navbar-links ${
          showDropdown.length === 3 ? "navbar-links-scrollable" : null
        }`}
      >
        <div className="desktop-navbar-link-container">
          <div className="desktop-navbar-link-title">
            <animated.div style={arrowAnimationHomepage}>
              <FaLongArrowAltUp />
            </animated.div>

            <h3 data-name="homepage" onClick={handleButtonToggle}>
              Homepage
            </h3>

            <animated.div style={arrowAnimationHomepage}>
              <FaLongArrowAltUp />
            </animated.div>
          </div>

          <hr className="line-under-title" />

          {showDropdown.includes("homepage") && (
            <animated.div
              style={{
                ...slideDropdownHomepage,
                overflow: "hidden",
              }}
              className="desktop-navbar-button-container"
            >
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
          <div className="desktop-navbar-link-title">
            <animated.div style={arrowAnimationHabitTracker}>
              <FaLongArrowAltUp />
            </animated.div>

            <h3 data-name="habitTracker" onClick={handleButtonToggle}>
              Habit Tracker
            </h3>

            <animated.div style={arrowAnimationHabitTracker}>
              <FaLongArrowAltUp />
            </animated.div>
          </div>

          <hr className="line-under-title" />

          {showDropdown.includes("habitTracker") && (
            <animated.div
              style={{
                ...slideDropdownHabitTracker,
                overflow: "hidden",
              }}
              className="desktop-navbar-button-container"
            >
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
          <div className="desktop-navbar-link-title">
            <animated.div style={arrowAnimationAccountSettings}>
              <FaLongArrowAltUp />
            </animated.div>

            <h3 data-name="accountSettings" onClick={handleButtonToggle}>
              Account Settings
            </h3>

            <animated.div style={arrowAnimationAccountSettings}>
              <FaLongArrowAltUp />
            </animated.div>
          </div>

          <hr className="line-under-title" />

          {showDropdown.includes("accountSettings") && (
            <animated.div
              style={{
                ...slideDropdownAccountSettings,
                overflow: "hidden",
              }}
              className="desktop-navbar-button-container"
            >
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

      <h1>
        <Image src={userData.profileimg} />
        {userData.username}
      </h1>

      <div className="navbar-auth-buttons">
        {userData ? (
          <Button
            id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
            className="signout-button"
            variant="danger"
            onClick={handleSignoutModalShow}
          >
            Sign Out
          </Button>
        ) : (
          <>
            <Button
              id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
              className="signin-button"
              variant="success"
              onClick={() => {
                setIsSignin(true);
                handleAuthModalShow();
              }}
            >
              Sign In
            </Button>
            <Button
              id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
              className="signup-button"
              onClick={() => {
                setIsSignin(false);
                handleAuthModalShow();
              }}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      {renderAuthModal()}
      <Signout
        showSignoutModal={showSignoutModal}
        handleSignoutModalClose={handleSignoutModalClose}
      />
    </>
  );
}
