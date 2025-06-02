import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { IoChevronUpSharp } from "react-icons/io5";

export const HomepageLinks = ({
  handleButtonToggle,
  showDropdown,
  setExpandSidebar,
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
    <div className="desktop-navbar-link-container">
      <div
        className="desktop-navbar-link-title"
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
          className="desktop-navbar-button-container"
        >
          <Button
            id="desktop-navbar-dashboard-button"
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/");
              setExpandSidebar(false);
            }}
          >
            Dashboard
          </Button>

          <Button
            id="desktop-navbar-summary-button"
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/summary");
              setExpandSidebar(false);
            }}
          >
            Daily Summary
          </Button>

          {/* <Button
            id="desktop-navbar-insight-button"
            className={`desktop-navbar-button`}
            onClick={() => {
              navigate("/insights");
              setExpandSidebar(false);
            }}
          >
            Insights & Analytics
          </Button> */}
        </animated.div>
      )}
    </div>
  );
};

HomepageLinks.propTypes = {
  handleButtonToggle: PropTypes.func.isRequired,
  showDropdown: PropTypes.array.isRequired,
};
