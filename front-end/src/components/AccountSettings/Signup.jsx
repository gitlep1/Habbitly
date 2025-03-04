import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { tokenContext, userContext } from "../../CustomContexts/Contexts";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signup = ({ handleSignUpClick, handleAuthModalClose }) => {
  let error = "";

  const navigate = useNavigate();

  const { setAuthUser } = useContext(userContext);
  const { setAuthToken } = useContext(tokenContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      password,
      email,
    };

    if (newUser.username.length > 12) {
      return toast.error(
        `Your current username:(${newUser.username}) is ${newUser.username.length} characters long. \n The max chracter length allowed is 12.`,
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

    await axios
      .post(`${API}/email/send-verification`, newUser)
      .then((res) => {
        clearFields();
        handleAuthModalClose();
        navigate("/email-verification", {
          state: {
            email: email,
            username: username,
            password: password,
          },
        });
      })
      .catch((err) => {
        return toast.error(err.response.data.error, {
          containerId: "toast-notify",
        });
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
              handleAuthModalClose();
            }}
          >
            Close
          </Button>
          {error && <p className="error-message">{error}</p>}
        </Form>
        <p
          className="switch-auth-mode"
          onClick={() => {
            handleSignUpClick();
          }}
        >
          Already have an account? Sign In
        </p>
      </div>
    );
  };

  return renderSignupForm();
};
