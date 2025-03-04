import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { tokenContext, userContext } from "../../CustomContexts/Contexts";
import { RemoveCookies } from "../../CustomFunctions/HandleCookies";

export const Signout = ({ showSignoutModal, handleSignoutModalClose }) => {
  const { setAuthUser } = useContext(userContext);
  const { setAuthToken } = useContext(tokenContext);

  const handleSignout = () => {
    RemoveCookies("authUser");
    RemoveCookies("authToken");
    setAuthUser(null);
    setAuthToken(null);

    handleSignoutModalClose();

    toast.success("You have been signed out", {
      containerId: "toast-notify",
    });

    setTimeout(() => {
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
