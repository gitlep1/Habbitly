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
    aboutMe: userCookieData?.about_me || "",
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
    aboutMe: userCookieData?.about_me || "",
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
  }, []);

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
          username: res.data.payload.username || "",
          email: res.data.payload.email || "",
          aboutMe: res.data.payload.about_me || "",
        }));
        setProfileImg(res.data.payload.profileimg || "");
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
        setProfileImg(res.data.payload.profileimg);

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
    if (formData.aboutMe.length > 500) {
      return toast.error("About Me cannot exceed 500 characters");
    }

    setIsLoading(true);
    const updatePayload = {
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined,
      about_me: formData.aboutMe,
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
        console.log({ error });
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
      formData.aboutMe === originalData.aboutMe &&
      formData.password === "");

  return (
    <div className="profile-container p-4 md:p-8 min-h-screen">
      <div className="profile-card max-w-5xl mx-auto mt-[6em] md:mt-0 rounded-2xl shadow-xl">
        <div className="profile-avatar-wrapper">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Image
              src={profileImg || "https://via.placeholder.com/200"}
              roundedCircle
              className="profile-avatar object-cover"
              alt="Profile"
            />
            <div className="absolute profile-edit-badge">Edit</div>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-center">
            {userCookieData?.username || "Your Profile"}
          </h2>
          <p className="text-lg text-gray-400 text-center">
            {userCookieData?.email}
          </p>
        </div>

        <div className="profile-details-form-container flex flex-col gap-6">
          <div>
            <h3 className="profile-section-title">Edit Profile Details</h3>
            <Form onSubmit={handleSubmit} className="space-y-6">
              <Form.Group controlId="formUsername">
                <Form.Label className="profile-label">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="profile-input"
                  maxLength={20}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label className="profile-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
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

              <Form.Group controlId="formAboutMe">
                <Form.Label className="profile-label">About Me</Form.Label>
                <Form.Control
                  as="textarea"
                  name="aboutMe"
                  rows={4}
                  value={formData.aboutMe}
                  onChange={handleChange}
                  className="profile-input"
                  maxLength={500}
                  placeholder="Tell us a little about yourself..."
                />
                <Form.Text className="text-muted">
                  {formData.aboutMe.length}/500 characters
                </Form.Text>
              </Form.Group>

              <div className="text-center pt-4">
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

          <div className="profile-about-me">
            <h3 className="profile-section-title">About Me</h3>
            <p>{formData.aboutMe || userCookieData?.about_me}</p>
          </div>
        </div>

        <div className="profile-recent-activity">
          <h3 className="profile-section-title">Recent Activity</h3>
          <ul>
            <li>
              <strong>Logged in:</strong> Just now
            </li>
            <li>
              <strong>Last post:</strong> 2 days ago
            </li>
            <li>
              <strong>Comments made:</strong> 15
            </li>
            <li>
              <strong>Likes received:</strong> 42
            </li>
          </ul>
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
