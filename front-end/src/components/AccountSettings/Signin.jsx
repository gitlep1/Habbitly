import "./auth-styles.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { Loading } from "../../CustomFunctions/Loading/Loading";

import { SetCookies } from "../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signin = ({
  handleSignUpClick,
  handleAuthModal,
  handleForgotPassword,
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    await axios
      .post(`${API}/users/signin`, existingUser, {
        withCredentials: true,
      })
      .then((res) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        SetCookies("authUser", res.data.payload, expirationDate);
        SetCookies("authToken", res.data.token, expirationDate);
        handleAuthModal();
        notify(res.data.payload);
      })
      .catch((err) => {
        const error = err?.response?.data?.error
          ? err?.response?.data?.error
          : err?.response?.data;

        return toast.error(`Sign in failed: ${error}`, {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsLoading(false);
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
        </Form>
        <p className="switch-auth-mode-container flex flex-col items-center">
          <span>
            Don&apos;t have an account?{" "}
            <span
              className="switch-auth-mode"
              onClick={() => {
                handleSignUpClick();
              }}
            >
              Sign Up
            </span>
          </span>
          <span
            className="switch-auth-mode"
            onClick={() => {
              handleForgotPassword();
            }}
          >
            Forgot Password?
          </span>
        </p>

        {isLoading ? <Loading message="Signing in..." /> : null}
      </div>
    );
  };

  return renderSigninForm();
};
