import "./Desktop.scss";
import { useState, useEffect, useContext } from "react";
import { Button, Image } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { useLocation } from "react-router-dom";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";

import { themeContext } from "../../../CustomContexts/Contexts";
import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

import { Signout } from "../../AccountSettings/Signout";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

import { HomepageLinks } from "./Links/1-Homepage";
import { HabitTrackerLinks } from "./Links/2-HabitTracker";
import { AccountSettingsLinks } from "./Links/3-AccountSettings";

export default function Desktop() {
  const location = useLocation();

  const { themeState, setThemeState } = useContext(themeContext);

  const userData = GetCookies("authUser");
  const expandCookie = GetCookies("expandCookie") || null;
  const expandedList = GetCookies("expandedLinks") || [];

  const [showDropdown, setShowDropdown] = useState(expandedList);

  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const [expandSidebar, setExpandSidebar] = useState(
    expandCookie ? true : false
  );

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

  const sidebarAnimation = useSpring({
    transform: expandSidebar ? "translateX(0%)" : "translateX(-93%)",
    config: { duration: 200 },
  });

  useEffect(() => {
    if (location.pathname === "/email-verification") {
      setExpandSidebar(false);
    }
    setShowDropdown(GetCookies("expandedLinks") || []);
  }, [location]);

  const expandSidebarCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (expandSidebar) {
      SetCookies("expandCookie", false, expirationDate);
    } else {
      SetCookies("expandCookie", true, expirationDate);
    }
    setExpandSidebar(!expandSidebar);
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
    <animated.nav
      className={`desktop-navbar desktop-navbar-container ${
        themeState === "dark" ? "dark-navbar" : "light-navbar"
      }`}
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
      </div>

      <div
        className={`navbar-expand-button ${
          themeState === "dark" ? "dark-expand-button" : "light-expand-button"
        }`}
        onClick={() => {
          expandSidebarCookie();
        }}
      >
        <div className="arrows arrow-set-1">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>

        <div className="arrows arrow-set-2">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>

        <div className="arrows arrow-set-3">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>

        <div className="arrows arrow-set-4">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>

        <div className="arrows arrow-set-5">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>

        <div className="arrows arrow-set-6">
          {expandSidebar ? (
            <>
              <MdArrowBackIos className="arrow arrow-1" />
              <MdArrowBackIos className="arrow arrow-2" />
              <MdArrowBackIos className="arrow arrow-3" />
            </>
          ) : (
            <>
              <MdArrowForwardIos className="arrow arrow-1" />
              <MdArrowForwardIos className="arrow arrow-2" />
              <MdArrowForwardIos className="arrow arrow-3" />
            </>
          )}
        </div>
      </div>
    </animated.nav>
  );
}
