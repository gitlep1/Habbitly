import "./Mobile.scss";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";
import { themeContext } from "../../../CustomContexts/Contexts";

import { Signout } from "../../AccountSettings/Signout";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

import { HomepageLinks } from "./Links/1-Homepage";
import { HabitTrackerLinks } from "./Links/2-HabitTracker";
import { AccountSettingsLinks } from "./Links/3-AccountSettings";

export default function Mobile() {
  const navigate = useNavigate();
  const location = useLocation();

  const { themeState, setThemeState } = useContext(themeContext);

  const userData = GetCookies("authUser");
  const expandCookie = GetCookies("expandCookie") || null;
  const expandedList = GetCookies("expandedLinks") || [];

  const [showDropdown, setShowDropdown] = useState(expandedList);

  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const [expandTopbar, setExpandTopbar] = useState(expandCookie ? true : false);

  const topbarMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const themeSwitcherRef = useRef(null);

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
    height: expandTopbar ? "91dvh" : "0",
    opacity: expandTopbar ? 1 : 0,
    zIndex: expandTopbar ? 1001 : 999,
    config: {
      duration: 500,
    },
  });

  useEffect(() => {
    if (location.pathname === "/email-verification") {
      setExpandTopbar(false);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        topbarMenuRef.current &&
        !topbarMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target) &&
        themeSwitcherRef.current &&
        !themeSwitcherRef.current.contains(event.target) &&
        expandTopbar
      ) {
        setExpandTopbar(false);
        SetCookies("expandCookie", false, 30);
      }
    };

    if (expandTopbar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandTopbar]);

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
    <nav className="mobile-sidebar">
      <div className="mobile-navbar-title-container">
        <div className="mobile-navbar-title">
          <Image src={StellyHappy} className="mobile-navbar-logo" />
          <p>Habbitly</p>
          <Image src={StellyAngry} className="mobile-navbar-logo" />
        </div>

        <div
          className="nav-theme-switcher-container"
          onClick={handleThemeStateCookie}
          ref={themeSwitcherRef}
        >
          <div className="nav-theme-switcher-outer-box">
            <div className="nav-theme-switcher-inner-box"></div>
            <FaMoon id="nav-dark-logo" />
            <IoIosSunny id="nav-light-logo" />
          </div>
        </div>
      </div>
      <div
        className="mobile-expanded-button-container"
        onClick={expandSidebarCookie}
        ref={toggleButtonRef}
      >
        <span className="mobile-expanded-button">
          {expandTopbar ? "Hide Menu" : "Show Menu"}
        </span>
      </div>
      <animated.div
        className="mobile-navbar-links"
        style={expandNavbarAnimation}
        ref={topbarMenuRef}
      >
        <HomepageLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
          setExpandTopbar={setExpandTopbar}
        />

        <HabitTrackerLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
          setExpandTopbar={setExpandTopbar}
        />

        <AccountSettingsLinks
          handleButtonToggle={handleButtonToggle}
          showDropdown={showDropdown}
          themeState={themeState}
          setExpandTopbar={setExpandTopbar}
        />

        {userData && (
          <div className="navbar-username">
            <Image
              src={userData.profileimg}
              className="navbar-profile-image"
              alt="User Profile"
              onClick={() => navigate("/profile")}
            />
            <h1>{userData.username}</h1>
          </div>
        )}

        <div className="navbar-auth-buttons">
          {userData && (
            <Button
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
