import "./EmailVerification.scss";
import { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Loading } from "../../CustomFunctions/Loading/Loading";

import { GetCookies, SetCookies } from "../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;
const RESEND_COOLDOWN_SECONDS = 60;

export const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username, password } = location.state || {};

  const [codeInput, setCodeInput] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownIntervalRef = useRef(null);

  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("dark-theme");

    return () => {
      document.body.classList.remove("dark-theme");
    };
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (cooldown === 0 && cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [cooldown]);

  const handleResendCode = async () => {
    if (cooldown > 0) {
      return toast.info(`Please wait ${cooldown} seconds before resending.`, {
        containerId: "toast-notify",
      });
    }

    if (!email) {
      return toast.error("No email found to resend code to.", {
        containerId: "toast-notify",
      });
    }

    setIsResending(true);
    setIsLoading(true);

    await axios
      .post(
        `${API}/email/send-verification`,
        { email },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        toast.success("Verification code sent! Please check your inbox.", {
          containerId: "toast-notify",
        });
        return setCooldown(RESEND_COOLDOWN_SECONDS);
      })
      .catch((error) => {
        return toast.error(
          error.response?.data?.error || "Failed to resend verification code.",
          {
            containerId: "toast-notify",
          }
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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

    setIsResending(false);
    setIsLoading(true);

    await axios
      .post(`${API}/email/verify-code`, userCodeData)
      .then(async () => {
        await axios
          .post(`${API}/users/signup`, userInfoData, { withCredentials: true })
          .then((res) => {
            toast.success(
              `Welcome ${res.data.payload.username}, You have been signed up successfully.`,
              {
                containerId: "toast-notify",
              }
            );

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            SetCookies("authUser", res.data.payload, expirationDate);
            SetCookies("authToken", res.data.token, expirationDate);

            return setTimeout(() => {
              navigate("/");
            }, 4500);
          })
          .catch((error) => {
            return toast.error(
              `Sign up failed: ${error?.response?.data?.error}`,
              {
                containerId: "toast-notify",
              }
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error, {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="email-verification-container">
      <div className="email-verification">
        <h1>Verify Your Email</h1>
        {email ? (
          <div>
            <h3>A code has been sent to: {email}</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCode">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter verification code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
              </Form.Group>
              <span className="spam-folder-note">
                If you do not see the code in your inbox please check your spam
                folder
              </span>
              <br />
              <br />
              <div className="d-flex flex-column align-items-center">
                <Button type="submit" className="verify-button mb-2">
                  Verify Email
                </Button>
                <div
                  onClick={cooldown > 0 ? null : handleResendCode}
                  className={`resend-text ${
                    cooldown > 0 ? "text-muted" : "text-primary cursor-pointer"
                  }`}
                  style={{
                    textDecoration: cooldown > 0 ? "none" : "underline",
                  }}
                >
                  Resend Code {cooldown > 0 && `(${cooldown}s)`}
                </div>
              </div>
            </Form>

            {isLoading ? (
              isResending ? (
                <Loading message="Re-sending Code..." />
              ) : (
                <Loading message="Verifying Code..." />
              )
            ) : null}
          </div>
        ) : (
          <p>No email provided</p>
        )}
      </div>
    </div>
  );
};
