import "./LandingDesktop.scss";

import { useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";

import { Signin } from "../../AccountSettings/Signin";
import { Signup } from "../../AccountSettings/Signup";

import LandingBackgroundCloud from "../../../assets/images/LandingPage/LandingBackgroundCloud.png";
import LeftSideCloud from "../../../assets/images/LandingPage/LeftSideCloud.png";
import RightSideCloud from "../../../assets/images/LandingPage/RightSideCloud.png";

export const LandingDesktop = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignin, setIsSignin] = useState(true);

  const handleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };

  const toggleForm = () => setIsSignin(!isSignin);

  const renderAuthModal = () => {
    return (
      <Modal
        show={showAuthModal}
        onHide={handleAuthModal}
        className="navbar-auth-modal"
      >
        <Modal.Header closeButton className="navbar-auth-modal-header">
          <Modal.Title>{isSignin ? "Sign In" : "Sign Up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-auth-modal-body">
          {isSignin ? (
            <Signin
              handleSignUpClick={toggleForm}
              handleAuthModal={handleAuthModal}
            />
          ) : (
            <Signup
              handleSignUpClick={toggleForm}
              handleAuthModal={handleAuthModal}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="landing-container h-screen">
      <div className="landing-header flex pl-10 pr-10 justify-between">
        <div className="landing-header-title">
          <h1>Habbitly</h1>
          <p>Habits & Goals</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="success"
            className="signin-button"
            onClick={() => {
              setIsSignin(true);
              handleAuthModal();
            }}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            className="signup-button"
            onClick={() => {
              setIsSignin(false);
              handleAuthModal();
            }}
          >
            Sign Up
          </Button>

          {renderAuthModal()}
        </div>
      </div>

      <div className="landing-main-content">
        <div className="landing-main-content-left-side-container">
          <h1>
            Habbitly Users <br /> 1,500
          </h1>
          <Image
            src={LeftSideCloud}
            alt="Landing Left Cloud"
            className="Landing-Left-Cloud"
          />
        </div>

        <div className="landing-main-content-get-started-container">
          <Image
            src={LandingBackgroundCloud}
            alt="Landing Background Cloud"
            className="w-75"
          />
          <Button variant="success" className="get-started-button py-3">
            Get Started
          </Button>
        </div>

        <div className="landing-main-content-right-side-container">
          <h1>
            AI <br /> Reminders
          </h1>
          <Image
            src={RightSideCloud}
            alt="Landing Right Cloud"
            className="Landing-Right-Cloud"
          />
        </div>
      </div>

      <div className="landing-features"></div>
    </div>
  );
};
