import "./auth-styles.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { Loading } from "../../CustomFunctions/Loading/Loading";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const ForgotPassword = ({ handleAuthModal, handleForgotPassword }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "") {
      return toast.error("Please make sure to enter an email.", {
        containerId: "toast-notify",
      });
    }

    setIsLoading(true);

    await axios
      .post(`${API}/email/forgot-password`, { email })
      .then((res) => {
        notify(res.data.success);
      })
      .catch((err) => {
        const error = err?.response?.data?.error;
        return toast.error(`${error}`, {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const notify = (success) => {
    toast.success(`${success}`, {
      containerId: "toast-notify",
    });
    setTimeout(() => {
      navigate("/");
    }, 4100);

    return clearFields();
  };

  const clearFields = () => {
    setEmail("");
  };

  const renderForgotPasswordForm = () => {
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
          <Button variant="primary" type="submit">
            Submit
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => {
              handleAuthModal();
              handleForgotPassword(false);
            }}
          >
            Close
          </Button>
        </Form>

        {isLoading ? <Loading message="Verifying Email..." /> : null}
      </div>
    );
  };

  return renderForgotPasswordForm();
};
