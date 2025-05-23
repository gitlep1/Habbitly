import "./Profile.scss";
import { useState, useEffect } from "react";
import { Button, Image, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

export const Profile = () => {
  const userCookieData = GetCookies("authUser");

  const [formData, setFormData] = useState({
    username: userCookieData?.username || "",
    email: userCookieData?.email || "",
    password: "",
  });

  const [profileImg, setProfileImg] = useState(
    userCookieData?.profileimg || ""
  );
  const [newProfileImgFile, setNewProfileImgFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [originalData] = useState({
    username: userCookieData?.username || "",
    email: userCookieData?.email || "",
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []); // eslint-disable-line

  const getUserData = async () => {
    await axios
      .get(`${API}/users/user`, {
        withCredentials: true,
      })
      .then((res) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        SetCookies("authUser", res.data.payload, expirationDate);

        setFormData((prev) => ({
          ...prev,
          username: userCookieData.username || "",
          email: userCookieData.email || "",
        }));
        setProfileImg(userCookieData.profileimg || "");
      })
      .catch((err) => {
        toast.error("Failed to fetch user data: " + err.message);
      });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImgFile(e.target.files[0]);
      setProfileImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageUpload = async () => {
    if (!newProfileImgFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsLoading(true);
    const formDataToUpload = new FormData();
    formDataToUpload.append("image", newProfileImgFile);

    await axios
      .post(`${API}/images/upload`, formDataToUpload, {
        withCredentials: true,
      })
      .then((res) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        SetCookies("authUser", res.data.payload, expirationDate);
        toast.success("Profile image updated!");
        setShowModal(false);
        setNewProfileImgFile(null);

        return toast.success("Profile image updated Successfully", {
          containerId: "general-toast",
        });
      })
      .catch((error) => {
        toast.error("Failed to upload image: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length > 20) {
      return toast.error("Username cannot exceed 20 characters");
    }

    setIsLoading(true);
    const updatePayload = {
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined,
    };

    await axios
      .put(`${API}/users/update`, updatePayload, {
        withCredentials: true,
      })
      .then((res) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        SetCookies("authUser", res.data.payload, expirationDate);
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "" }));

        return toast.success("Profile updated Successfully", {
          containerId: "general-toast",
        });
      })
      .catch((error) => {
        toast.error("Failed to update profile: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isSaveDisabled =
    isLoading ||
    (formData.username === originalData.username &&
      formData.email === originalData.email &&
      formData.password === "");

  return (
    <div className="profile-container p-4 md:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto mt-[6em] md:mt-20 rounded-2xl shadow-xl profile-card">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Image
              src={profileImg || "https://via.placeholder.com/120"}
              roundedCircle
              className="profile-avatar object-cover border-4 border-primary shadow-sm"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Edit
            </div>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">
              {userCookieData?.username + "'s" + " Profile" ||
                "Edit Your Profile"}
            </h2>
            <Form onSubmit={handleSubmit} className="space-y-5">
              <Form.Group>
                <Form.Label className="profile-label">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="profile-input"
                  maxLength={15}
                  placeholder="Username"
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="profile-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Email"
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="profile-label">New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={handleChange}
                  className="profile-input"
                  autoComplete="new-password"
                />
              </Form.Group>

              <div className="text-center md:text-left pt-4">
                <Button
                  type="submit"
                  className="px-6"
                  disabled={isSaveDisabled}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select new profile image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
          {profileImg && (
            <div className="mt-3 text-center">
              <Image
                src={profileImg}
                roundedCircle
                className="w-32 h-32 object-cover mx-auto border-2 border-primary"
                alt="Preview"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImageUpload}
            disabled={isLoading || !newProfileImgFile}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
