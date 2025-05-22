import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

import { Loading } from "../../CustomFunctions/Loading/Loading";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signout = ({ showSignoutModal, handleSignoutModalClose }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);

    await axios
      .post(
        `${API}/users/signout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        handleSignoutModalClose();
        toast.success("You have been signed out", {
          containerId: "toast-notify",
        });
        return setTimeout(() => {
          navigate("/");
        }, 4100);
      })
      .catch((err) => {
        return toast.error(`Sign out failed: ${err?.response?.data?.err}`, {
          containerId: "toast-notify",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal show={showSignoutModal} onHide={handleSignoutModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Out</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to sign out?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSignout}>
          Sign Out
        </Button>
        <Button variant="primary" onClick={handleSignoutModalClose}>
          Cancel
        </Button>
      </Modal.Footer>

      {isLoading ? <Loading message="Signing in..." /> : null}
    </Modal>
  );
};

Signout.propTypes = {
  showSignoutModal: PropTypes.bool.isRequired,
  handleSignoutModalClose: PropTypes.func.isRequired,
};
