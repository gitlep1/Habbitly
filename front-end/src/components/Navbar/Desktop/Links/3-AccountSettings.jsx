import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { FaLongArrowAltUp } from "react-icons/fa";

export const AccountSettingsLinks = ({
  handleButtonToggle,
  showDropdown,
  themeState,
}) => {
  const navigate = useNavigate();

  const slideDropdownAccountSettings = useSpring({
    opacity: showDropdown.includes("accountSettings") ? 1 : 0,
    transform: showDropdown.includes("accountSettings")
      ? "translateY(0%)"
      : "translateY(-50%)",
    config: { tension: 200, friction: 20 },
  });

  const arrowAnimationAccountSettings = useSpring({
    transform: showDropdown.includes("accountSettings")
      ? "rotate(180deg)"
      : "rotate(0deg)",
    config: { tension: 200, friction: 15 },
  });

  return (
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
              navigate("/profile");
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
              navigate("/notifications");
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
              navigate("/preferences");
            }}
          >
            Preferences
          </Button>
        </animated.div>
      )}
    </div>
  );
};

AccountSettingsLinks.propTypes = {
  handleButtonToggle: PropTypes.func.isRequired,
  showDropdown: PropTypes.array.isRequired,
  themeState: PropTypes.string.isRequired,
};
