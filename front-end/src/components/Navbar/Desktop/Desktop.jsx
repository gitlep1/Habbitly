import "./Desktop.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Modal } from "react-bootstrap";

import { themeContext } from "../../../CustomContexts/Contexts";

import StellyHappy from "../../../assets/images/StellyHappy.png";
import StellyAngry from "../../../assets/images/StellyAngry.png";

export default function Desktop() {
  const navigate = useNavigate();
  const { themeState, setThemeState } = useContext(themeContext);

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleShow = (auth) => {
    if (auth === "signin") {
      setShowSignInModal(true);
      setShowSignUpModal(false);
    } else {
      setShowSignInModal(false);
      setShowSignUpModal(true);
    }
  };

  const handleClose = () => {
    if (showSignInModal) {
      setShowSignInModal(false);
      setShowSignUpModal(false);
    } else if (showSignUpModal) {
      setShowSignUpModal(false);
      setShowSignInModal(false);
    }
  };

  const renderSignInModal = () => {
    return (
      <Modal
        show={showSignInModal}
        onHide={handleClose}
        className="navbar-signin-modal"
      >
        <Modal.Header closeButton className="navbar-signin-modal-header">
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-signin-modal-body">
          <p>Sign In</p>
        </Modal.Body>
        <Modal.Footer className="navbar-signin-modal-footer">
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success">Sign In</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderSignUpModal = () => {
    return (
      <Modal
        show={showSignUpModal}
        onHide={handleClose}
        className="navbar-signup-modal"
      >
        <Modal.Header closeButton className="navbar-signup-modal-header">
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-signup-modal-body">
          <p>Sign Up</p>
        </Modal.Body>
        <Modal.Footer className="navbar-signup-modal-footer">
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success">Sign Up</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <div className="desktop-navbar-title">
        <Image
          src={StellyHappy}
          className="desktop-navbar-logo"
          onClick={() => {
            setThemeState("light");
          }}
        />
        <p>Habbitly</p>
        <Image
          src={StellyAngry}
          className="desktop-navbar-logo"
          onClick={() => {
            setThemeState("dark");
          }}
        />
      </div>

      <div className="desktop-navbar-links">
        <div className="desktop-navbar-link-container">
          <h3>Homepage</h3>
          <hr />
          <br />

          <div className="desktop-navbar-button-container">
            <Button
              id="desktop-navbar-dashboard-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/");
              }}
            >
              Dashboard
            </Button>

            <Button
              id="desktop-navbar-summary-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/summary");
              }}
            >
              Daily Summary
            </Button>

            <Button
              id="desktop-navbar-insight-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/insights");
              }}
            >
              Insights & Analytics
            </Button>
          </div>
        </div>

        <div className="desktop-navbar-link-container">
          <h3>Habit Tracker</h3>
          <hr />
          <br />

          <div className="desktop-navbar-button-container">
            <Button
              id="desktop-navbar-habit-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/habit-tracker");
              }}
            >
              Habits
            </Button>

            <Button
              id="desktop-navbar-create-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
            >
              Create New Habit
            </Button>

            <Button
              id="desktop-navbar-history-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/habit-history");
              }}
            >
              Habit History
            </Button>
          </div>
        </div>

        <div className="desktop-navbar-link-container">
          <h3>Account Settings</h3>
          <hr />
          <br />

          <div className="desktop-navbar-button-container">
            <Button
              id="desktop-navbar-profile-button"
              className={`desktop-navbar-button ${
                themeState === "dark" ? "dark-button" : "light-button"
              }`}
              onClick={() => {
                navigate("/");
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
                navigate("/summary");
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
                navigate("/insights");
              }}
            >
              Preferences
            </Button>
          </div>
        </div>
      </div>

      <div className="navbar-auth-buttons">
        <Button
          id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
          className="signin-button"
          variant="success"
          onClick={() => {
            handleShow("signin");
          }}
        >
          Sign In
        </Button>
        <Button
          id={`${themeState === "dark" ? "dark-button" : "light-button"}`}
          className="signup-button"
          onClick={() => {
            handleShow("signup");
          }}
        >
          Sign Up
        </Button>
      </div>

      {renderSignInModal()}
      {renderSignUpModal()}
    </>
  );
}
