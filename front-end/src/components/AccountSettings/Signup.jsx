import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { Loading } from "../../CustomFunctions/Loading/Loading";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signup = ({ handleSignUpClick, handleAuthModal }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      password,
      email,
    };

    if (newUser.username.length > 20) {
      return toast.error(
        `Your current username:(${newUser.username}) is ${newUser.username.length} characters long. \n The max chracter length allowed is 20.`,
        {
          containerId: "toast-notify",
        }
      );
    }

    if (
      newUser.username === "" ||
      newUser.password === "" ||
      newUser.email === ""
    ) {
      return toast.error("Please make sure to fill out all fields.", {
        containerId: "toast-notify",
      });
    }

    if (confirmPassword !== password) {
      return toast.error("Passwords do not match", {
        containerId: "toast-notify",
      });
    }

    setIsLoading(true);

    await axios
      .post(`${API}/email/send-verification`, newUser, {
        withCredentials: true,
      })
      .then(() => {
        clearFields();
        handleAuthModal();
        navigate("/email-verification", {
          state: {
            email: email,
            username: username,
            password: password,
          },
        });
      })
      .catch((err) => {
        const error = err?.response?.data?.error;

        return toast.error(
          error.includes("Email")
            ? error
            : "ERROR: Please try again. If this continues try again in a few hours as the server might be down.",
          {
            containerId: "toast-notify",
          }
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
  };

  const renderSignupForm = () => {
    return (
      <div className="auth-container">
        <Form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3 form-input" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p style={{ fontSize: "12px" }} className="small-text-muted">
              We&#39;ll never share your email with anyone else.
            </p>
          </Form.Group>
          <Form.Group className="mb-3 form-input" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-input" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group
            className="mb-3 form-input"
            controlId="formBasicConfirmPassword"
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => {
              handleAuthModal();
            }}
          >
            Close
          </Button>
        </Form>
        <p className="switch-auth-mode-container">
          Already have an account?{" "}
          <span
            className="switch-auth-mode"
            onClick={() => {
              handleSignUpClick();
            }}
          >
            Sign In
          </span>
        </p>

        {isLoading ? <Loading message="Signing up..." /> : null}
      </div>
    );
  };

  return renderSignupForm();
};
