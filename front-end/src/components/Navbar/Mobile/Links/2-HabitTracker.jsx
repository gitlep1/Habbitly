import { useState } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { FaLongArrowAltUp } from "react-icons/fa";

import { AddAHabit } from "../../../HabitTracker/1 - Habits/AddAHabit";

export const HabitTrackerLinks = ({
  handleButtonToggle,
  showDropdown,
  themeState,
}) => {
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);

  const slideDropdownHabitTracker = useSpring({
    opacity: showDropdown.includes("habitTracker") ? 1 : 0,
    transform: showDropdown.includes("habitTracker")
      ? "translateY(0%)"
      : "translateY(-50%)",
    config: { tension: 200, friction: 20 },
  });

  const arrowAnimationHabitTracker = useSpring({
    transform: showDropdown.includes("habitTracker")
      ? "rotate(180deg)"
      : "rotate(0deg)",
    config: { tension: 200, friction: 15 },
  });

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  return (
    <div className="mobile-navbar-link-container">
      <div className="mobile-navbar-link-title">
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
          className="mobile-navbar-button-container"
        >
          <Button
            id="mobile-navbar-habit-button"
            className={`mobile-navbar-button ${
              themeState === "dark" ? "dark-button" : "light-button"
            }`}
            onClick={() => {
              navigate("/habit-tracker");
            }}
          >
            Habits
          </Button>

          <Button
            id="mobile-navbar-create-button"
            className={`mobile-navbar-button ${
              themeState === "dark" ? "dark-button" : "light-button"
            }`}
            onClick={() => handleAddClick()}
          >
            Create New Habit
          </Button>

          <Button
            id="mobile-navbar-history-button"
            className={`mobile-navbar-button ${
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

      {showAddModal && (
        <AddAHabit
          showAddModal={showAddModal}
          onHide={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

HabitTrackerLinks.propTypes = {
  handleButtonToggle: PropTypes.func.isRequired,
  showDropdown: PropTypes.array.isRequired,
  themeState: PropTypes.string.isRequired,
};
