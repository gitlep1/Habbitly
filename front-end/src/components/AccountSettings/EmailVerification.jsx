import "./EmailVerification.scss";
import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { userContext, tokenContext } from "../../CustomContexts/Contexts";
import { SetCookies } from "../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username, password } = location.state || {};

  const { setAuthUser } = useContext(userContext);
  const { setAuthToken } = useContext(tokenContext);

  const [codeInput, setCodeInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCodeData = {
      email,
      code: codeInput,
    };

    const userInfoData = {
      email,
      username,
      password,
    };

    await axios
      .post(`${API}/email/verify-code`, userCodeData)
      .then(async (res) => {
        await axios
          .post(`${API}/users/signup`, userInfoData)
          .then((res) => {
            toast.success(
              `Welcome ${res.data.payload.username}, You have been signed up successfully.`,
              {
                containerId: "toast-notify",
              }
            );
            setAuthUser(res.data.payload);
            setAuthToken(res.data.token);

            SetCookies("authUser", res.data.payload, 30);
            SetCookies("authToken", res.data.token, 30);
          })
          .catch((error) => {
            return toast.error(`Sign up failed: ${error.response.data.error}`, {
              containerId: "toast-notify",
            });
          });

        toast.success(res.data.message, {
          containerId: "toast-notify",
        });
        setTimeout(() => {
          navigate("/");
        }, 4500);
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
          containerId: "toast-notify",
        });
      });
  };

  return (
    <div className="email-verification">
      <h1>Verify Your Email</h1>
      {email ? (
        <div>
          <h3>A code has been sent to: {email}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCode">
              <Form.Label style={{ color: "lightgreen" }}>
                Verification Code{" "}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter verification code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
            </Form.Group>
            <span style={{ fontSize: "15px", color: "red" }}>
              If you do not see the code in your inbox please check your spam
              folder
            </span>
            <br />
            <br />
            <Button type="submit">Verify Email</Button>
          </Form>
        </div>
      ) : (
        <p>No email provided</p>
      )}
    </div>
  );
};
