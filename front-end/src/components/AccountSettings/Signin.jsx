import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signin = ({ handleSignUpClick, handleAuthModal }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingUser = {
      email,
      password,
    };

    if (existingUser.password === "" || existingUser.email === "") {
      return toast.error("Please make sure to fill out all fields.", {
        containerId: "toast-notify",
      });
    }

    await axios
      .post(`${API}/users/signin`, existingUser, {
        withCredentials: true,
      })
      .then((res) => {
        notify(res.data.payload);
        handleAuthModal();
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const notify = (existingUser) => {
    toast.success(
      `Welcome ${existingUser.username}, You have been signed in.`,
      {
        containerId: "toast-notify",
      }
    );
    setTimeout(() => {
      navigate("/");
    }, 4100);

    return clearFields();
  };

  const clearFields = () => {
    setPassword("");
    setEmail("");
  };

  const renderSigninForm = () => {
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
          <Button variant="primary" type="submit">
            Sign In
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => {
              handleAuthModal();
            }}
          >
            Close
          </Button>
          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          )}
        </Form>
        <p className="switch-auth-mode-container">
          Don&apos;t have an account?{" "}
          <span
            className="switch-auth-mode"
            onClick={() => {
              handleSignUpClick();
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    );
  };

  return renderSigninForm();
};
