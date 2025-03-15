import "./Desktop.scss";
import { useState, useContext } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

import { themeContext } from "../../../CustomContexts/Contexts";
import { GetCookies } from "../../../CustomFunctions/HandleCookies";

import { Signup } from "../../AccountSettings/Signup";
import { Signin } from "../../AccountSettings/Signin";
import { Signout } from "../../AccountSettings/Signout";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

import { HomepageLinks } from "./Links/1-Homepage";
import { HabitTrackerLinks } from "./Links/2-HabitTracker";
import { AccountSettingsLinks } from "./Links/3-AccountSettings";

export default function Desktop() {
  const { themeState, setThemeState } = useContext(themeContext);

  const userData = GetCookies("authUser");

  const [showDropdown, setShowDropdown] = useState([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [isSignin, setIsSignin] = useState(true);

  const [expandSidebar, setExpandSidebar] = useState(true);

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

  const sidebarAnimation = useSpring({
    transform: expandSidebar ? "translateX(0%)" : "translateX(-90%)",
    config: { duration: 200 },
  });

  return (
    <animated.nav
      className="desktop-navbar desktop-navbar-container"
      style={sidebarAnimation}
    >
      <div className="desktop-navbar-links-container">
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
        </div>

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
      </div>

      <div
        className={`navbar-expand-button ${
          themeState === "dark" ? "dark-expand-button" : "light-expand-button"
        }`}
        onClick={() => {
          setExpandSidebar(!expandSidebar);
        }}
      >
        <div className="arrows arrow-set-1">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>

        <div className="arrows arrow-set-2">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>

        <div className="arrows arrow-set-3">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>

        <div className="arrows arrow-set-4">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>

        <div className="arrows arrow-set-5">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>

        <div className="arrows arrow-set-6">
          <MdArrowForwardIos className="arrow arrow-1" />
          <MdArrowForwardIos className="arrow arrow-2" />
          <MdArrowForwardIos className="arrow arrow-3" />
        </div>
      </div>
    </animated.nav>
  );
}
