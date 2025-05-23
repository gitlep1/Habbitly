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
  const expandedList = GetCookies("expandedLinks") || [];

  const [showDropdown, setShowDropdown] = useState(expandedList);

  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const [expandTopbar, setExpandTopbar] = useState(expandCookie ? true : false);

  const handleSignoutModalShow = () => {
    setShowSignoutModal(true);
  };

  const handleSignoutModalClose = () => {
    setShowSignoutModal(false);
  };

  const handleButtonToggle = (e) => {
    const name = e.target.dataset.name;
    let updatedDropdowns;

    if (showDropdown.includes(name)) {
      updatedDropdowns = showDropdown.filter((item) => item !== name);
    } else {
      updatedDropdowns = [...showDropdown, name];
    }

    setShowDropdown(updatedDropdowns);
    SetCookies("expandedLinks", updatedDropdowns, 7);
  };

  const expandNavbarAnimation = useSpring({
    display: expandTopbar ? "flex" : "none",
    height: expandTopbar ? "100dvh" : "0",
    opacity: expandTopbar ? 1 : 0,
    zIndex: expandTopbar ? 1 : -1,
    config: {
      duration: 500,
    },
  });

  useEffect(() => {
    if (location.pathname === "/email-verification") {
      setExpandTopbar(false);
    }
  }, [location]);

  const expandSidebarCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (expandTopbar) {
      SetCookies("expandCookie", false, expirationDate);
    } else {
      SetCookies("expandCookie", true, expirationDate);
    }
    setExpandTopbar(!expandTopbar);
  };

  const handleThemeStateCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (themeState === "dark") {
      SetCookies("theme", "light", expirationDate);
      setThemeState("light");
    } else {
      SetCookies("theme", "dark", expirationDate);
      setThemeState("dark");
    }
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
              handleThemeStateCookie();
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
          {expandTopbar ? "Hide Menu" : "Show Menu"}
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
          {userData && (
            <Button
              id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
              className="signout-button"
              variant="danger"
              onClick={handleSignoutModalShow}
            >
              Sign Out
            </Button>
          )}
        </div>

        <Signout
          showSignoutModal={showSignoutModal}
          handleSignoutModalClose={handleSignoutModalClose}
        />
      </animated.div>
    </nav>
  );
}
