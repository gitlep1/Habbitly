import "./Mobile.scss";
import { useState, useEffect, useContext } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { useLocation } from "react-router-dom";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";
import { themeContext } from "../../../CustomContexts/Contexts";

import { Signin } from "../../AccountSettings/Signin";
import { Signup } from "../../AccountSettings/Signup";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

import { HomepageLinks } from "./Links/1-Homepage";
import { HabitTrackerLinks } from "./Links/2-HabitTracker";
import { AccountSettingsLinks } from "./Links/3-AccountSettings";
import { Signout } from "../../AccountSettings/Signout";

export default function Mobile() {
  const location = useLocation();

  const { themeState, setThemeState } = useContext(themeContext);

  const userData = GetCookies("authUser");
  const expandCookie = GetCookies("expandCookie") || null;

  const [showDropdown, setShowDropdown] = useState([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [isSignin, setIsSignin] = useState(true);

  const [expanded, setExpanded] = useState(expandCookie ? true : false);

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

  const expandNavbarAnimation = useSpring({
    display: expanded ? "flex" : "none",
    height: expanded ? "100dvh" : "0",
    opacity: expanded ? 1 : 0,
    zIndex: expanded ? 1 : -1,
    config: {
      duration: 500,
    },
  });

  useEffect(() => {
    if (location.pathname === "/email-verification") {
      setExpanded(false);
    }
  }, [location]);

  const expandSidebarCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (expanded) {
      SetCookies("expandCookie", false, expirationDate);
    } else {
      SetCookies("expandCookie", true, expirationDate);
    }
    setExpanded(!expanded);
  };

  return (
    <nav
      className={`mobile-sidebar ${
        themeState === "dark" ? "dark-navbar " : "light-navbar"
      }`}
    >
      <div className="mobile-navbar-title-container">
        <div className="mobile-navbar-title">
          <Image src={StellyHappy} className="mobile-navbar-logo" />
          <p>Habbitly</p>
          <Image src={StellyAngry} className="mobile-navbar-logo" />
        </div>

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

      <div
        className={`mobile-expanded-button-container ${
          themeState === "dark"
            ? "darkmode-expanded-container"
            : "lightmode-expanded-container"
        }`}
        onClick={() => {
          expandSidebarCookie();
        }}
      >
        <span
          className={`mobile-expanded-button ${
            themeState === "dark" ? "darkmode-expanded" : "lightmode-expanded"
          }`}
        >
          {expanded ? "Hide Menu" : "Show Menu"}
        </span>
      </div>

      <animated.div
        className="mobile-navbar-links"
        style={expandNavbarAnimation}
      >
        <HomepageLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
        />

        <HabitTrackerLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
        />

        <AccountSettingsLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
        />

        {userData && (
          <div className="navbar-username">
            <Image src={userData.profileimg} className="navbar-profile-image" />
            <h1>{userData.username}</h1>
          </div>
        )}

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
      </animated.div>
    </nav>
  );
}
