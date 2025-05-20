import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Signout = ({ showSignoutModal, handleSignoutModalClose }) => {
  const handleSignout = async () => {
    await axios.post(
      `${API}/users/signout`,
      {},
      {
        withCredentials: true,
      }
    );

    handleSignoutModalClose();

    toast.success("You have been signed out", {
      containerId: "toast-notify",
    });

    return setTimeout(() => {
      window.location.reload();
    }, 4100);
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
    </Modal>
  );
};

Signout.propTypes = {
  showSignoutModal: PropTypes.bool.isRequired,
  handleSignoutModalClose: PropTypes.func.isRequired,
};
