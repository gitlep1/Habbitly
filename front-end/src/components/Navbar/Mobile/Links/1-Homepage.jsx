import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoChevronUpSharp } from "react-icons/io5";

export const HomepageLinks = ({
  handleButtonToggle,
  showDropdown,
  themeState,
  setExpandTopbar,
}) => {
  const navigate = useNavigate();

  const slideDropdownHomepage = useSpring({
    opacity: showDropdown.includes("homepage") ? 1 : 0,
    transform: showDropdown.includes("homepage")
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

  return (
    <div className="mobile-navbar-link-container">
      <div
        className="mobile-navbar-link-title"
        data-name="homepage"
        onClick={handleButtonToggle}
      >
        <h3 data-name="homepage" onClick={handleButtonToggle}>
          Homepage
        </h3>

        <animated.div style={arrowAnimationHomepage}>
          <IoChevronUpSharp />
        </animated.div>
      </div>

      <hr className="line-under-title" />

      {showDropdown.includes("homepage") && (
        <animated.div
          style={{
            ...slideDropdownHomepage,
            overflow: "hidden",
          }}
          className="mobile-navbar-button-container"
        >
          <Button
            id="mobile-navbar-dashboard-button"
            className={`mobile-navbar-button ${
              themeState === "dark" ? "dark-button" : "light-button"
            }`}
            onClick={() => {
              navigate("/");
              setExpandTopbar(false);
            }}
          >
            Dashboard
          </Button>

          <Button
            id="mobile-navbar-summary-button"
            className={`mobile-navbar-button ${
              themeState === "dark" ? "dark-button" : "light-button"
            }`}
            onClick={() => {
              navigate("/summary");
              setExpandTopbar(false);
            }}
          >
            Daily Summary
          </Button>

          <Button
            id="mobile-navbar-insight-button"
            className={`mobile-navbar-button ${
              themeState === "dark" ? "dark-button" : "light-button"
            }`}
            onClick={() => {
              navigate("/insights");
              setExpandTopbar(false);
            }}
          >
            Insights & Analytics
          </Button>
        </animated.div>
      )}
    </div>
  );
};

HomepageLinks.propTypes = {
  handleButtonToggle: PropTypes.func.isRequired,
  showDropdown: PropTypes.array.isRequired,
  themeState: PropTypes.string.isRequired,
};
