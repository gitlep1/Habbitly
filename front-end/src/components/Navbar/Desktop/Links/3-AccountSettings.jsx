import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoChevronUpSharp } from "react-icons/io5";

export const AccountSettingsLinks = ({
  handleButtonToggle,
  showDropdown,
  setExpandSidebar,
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
      <div
        className="desktop-navbar-link-title"
        data-name="accountSettings"
        onClick={handleButtonToggle}
      >
        <h3 data-name="accountSettings" onClick={handleButtonToggle}>
          Account Settings
        </h3>

        <animated.div style={arrowAnimationAccountSettings}>
          <IoChevronUpSharp />
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
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/profile");
              setExpandSidebar(false);
            }}
          >
            Profile
          </Button>

          {/* <Button
            id="desktop-navbar-notifications-button"
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/notifications");
              setExpandSidebar(false);
            }}
          >
            Notifications
          </Button> */}

          <Button
            id="desktop-navbar-preferences-button"
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/preferences");
              setExpandSidebar(false);
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
};
