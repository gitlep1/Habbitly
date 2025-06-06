import "./Landing.scss";
import { useState, useEffect } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import axios from "axios";

import { Signin } from "../AccountSettings/Signin";
import { Signup } from "../AccountSettings/Signup";
import { ForgotPassword } from "../AccountSettings/ForgotPassword";

import { GetCookies } from "../../CustomFunctions/HandleCookies";

import LandingBackgroundCloud from "../../assets/images/LandingPage/LandingBackgroundCloud.png";
import LeftSideCloud from "../../assets/images/LandingPage/LeftSideCloud.png";
import RightSideCloud from "../../assets/images/LandingPage/RightSideCloud.png";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Landing = () => {
  const authUserData = GetCookies("authUser") || null;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignin, setIsSignin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(1500);

  const handleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };

  const toggleForm = () => setIsSignin(!isSignin);
  const toggleForgotPassword = () => setIsForgotPassword(!isForgotPassword);

  useEffect(() => {
    fetchRegisteredCount();
    const interval = setInterval(() => {
      if (authUserData) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authUserData]);

  const renderAuthModal = () => {
    return (
      <Modal
        show={showAuthModal}
        onHide={() => {
          handleAuthModal();
          setIsForgotPassword(false);
        }}
        className="navbar-auth-modal"
      >
        <Modal.Header closeButton className="navbar-auth-modal-header">
          <Modal.Title>{isSignin ? "Sign In" : "Sign Up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="navbar-auth-modal-body">
          {isSignin ? (
            isForgotPassword ? (
              <ForgotPassword
                handleAuthModal={handleAuthModal}
                handleForgotPassword={toggleForgotPassword}
              />
            ) : (
              <Signin
                handleSignUpClick={toggleForm}
                handleAuthModal={handleAuthModal}
                handleForgotPassword={toggleForgotPassword}
              />
            )
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

  const fetchRegisteredCount = async () => {
    return axios
      .get(`${API}/registered-count`)
      .then((res) => {
        const count = res.data.payload.count;
        if (count <= 50) {
          setRegisteredCount(50);
        } else if (count <= 100) {
          setRegisteredCount(100);
        } else if (count <= 500) {
          setRegisteredCount(500);
        } else if (count <= 1000) {
          setRegisteredCount(res.data.payload.count);
        }
      })
      .catch((err) => {
        console.error("Error fetching registered count:", err);
        setRegisteredCount(1500);
      });
  };

  const features = [
    {
      title: "Track Habits",
      description:
        "Easily log daily habits and visualize your consistency with intuitive progress bars and streak counters.",
    },
    {
      title: "Set SMART Goals",
      description:
        "Define Specific, Measurable, Achievable, Relevant, and Time-bound goals that evolve with your progress.",
    },
    {
      title: "AI-Powered Reminders",
      description:
        "Get intelligent nudges and personalized check-ins based on your performance patterns and behavior.",
    },
    {
      title: "Progress Analytics",
      description:
        "Dive into detailed habit analytics including charts, heatmaps, and goal success rates over time.",
    },
    {
      title: "Motivational Insights",
      description:
        "Receive encouragement and motivational tips tailored to your journey using AI sentiment tracking.",
    },
    {
      title: "Flexible Scheduling",
      description:
        "Customize habit frequency, skip days, or reschedule goals — Habbitly adapts to your life, not the other way around.",
    },
  ];

  return (
    <div className="landing-container min-h-screen flex flex-col">
      <div className="landing-header flex justify-between items-center px-6 py-4 shadow-md z-50">
        <div className="landing-header-title">
          <h1 className="text-2xl font-bold">Habbitly</h1>
          <p className="text-sm text-gray-600">Habits & Goals</p>
        </div>

        <div className="landing-auth-buttons flex gap-2">
          <Button
            className="signin-button"
            onClick={() => {
              setIsSignin(true);
              handleAuthModal();
            }}
          >
            Sign In
          </Button>
          <Button
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

      <div className="landing-main-content flex flex-col justify-center md:grid md:grid-cols-[100px_1fr_100px] lg:grid-cols-[200px_1fr_200px]">
        <div className="landing-main-content-side-container hidden md:flex flex-col justify-between w-[200%] mt-4">
          <h1>
            Habbitly Users <br /> {registeredCount}
          </h1>
          <Image
            src={LeftSideCloud}
            alt="Landing Left Cloud"
            className="Landing-Left-Cloud"
          />
        </div>

        <div className="landing-main-content-get-started-container p-4 sm:p-0">
          <Image
            src={LandingBackgroundCloud}
            alt="Landing Background Cloud"
            className="15em sm:w-[25em] md:w-[35em] lg:w-[40em]"
          />
          <Button
            variant="success"
            className="get-started-button py-3 text-xl w-3/4 sm:w-1/2 lg:w-50"
            onClick={() => {
              setIsSignin(false);
              handleAuthModal();
            }}
          >
            Get Started
          </Button>
        </div>

        <div className="landing-main-content-side-container hidden md:flex flex-col justify-between w-[200%] relative md:right-[6.5em] lg:right-[12.5em] mt-4">
          <h1>
            AI-Driven <br /> Support
          </h1>
          <Image
            src={RightSideCloud}
            alt="Landing Right Cloud"
            className="Landing-Right-Cloud"
          />
        </div>
      </div>

      <div className="landing-features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-12 h-101">
        {features.map((feature, idx) => {
          return (
            <div
              key={idx}
              className="feature-card rounded-2xl shadow-xl p-6 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-100">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
