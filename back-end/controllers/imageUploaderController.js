const express = require("express");
const jwt = require("jsonwebtoken");
const images = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllProfileImages,
  getProfileImageByID,
  createProfileImage,
  updateProfileImage,
  deleteProfileImage,
} = require("../queries/imageUploaderQueries");

const {
  checkProfileImageValues,
  checkProfileImageExtraEntries,
} = require("../validation/entryValidation");
const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const { uploadImageToImgur } = require("../controllers/imageUploaderFunction");

images.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  try {
    const allProfileImages = await getAllProfileImages();
    console.log("=== GET all profile images", allProfileImages, "===");

    if (allProfileImages) {
      res.status(200).json({ payload: allProfileImages });
    } else {
      res.status(404).send("Cannot find any profile images");
    }
  } catch (error) {
    console.error("ERROR images.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

images.get(
  "/image/:id",
  requireAuth(),
  scopeAuth(["read:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const getProfileImage = await getProfileImageByID(id);
      console.log("=== GET profile image by ID", getProfileImage, "===");

      if (getProfileImage) {
        if (getProfileImage.user_id !== decoded.user.id) {
          res.status(401).send("Unauthorized");
          return;
        }

        res.status(200).json({ payload: getProfileImage });
      } else {
        res.status(404).send("Cannot find profile image");
      }
    } catch (error) {
      console.error("ERROR images.GET /:id", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

images.post(
  "/upload",
  requireAuth(),
  scopeAuth(["write:user"]),
  upload.single("image"),
  checkProfileImageValues,
  checkProfileImageExtraEntries,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = req.file.buffer;
      const { image_url, delete_hash } = await uploadImageToImgur(fileBuffer);

      const newProfileImageData = {
        user_id: req.body.user_id,
        image_url,
        delete_hash,
      };

      const createdProfileImage = await createProfileImage(newProfileImageData);
      console.log("=== POST new profile image", createdProfileImage, "===");

      if (createdProfileImage) {
        res.status(200).json({ payload: createdProfileImage });
      } else {
        res.status(404).send("Profile image not created");
      }
    } catch (error) {
      console.error("ERROR images.POST /", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

images.put(
  "/update/:id",
  requireAuth(),
  scopeAuth(["write:user"]),
  checkProfileImageExtraEntries,
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const updatedProfileImageData = {
      image_url: req.body.image_url,
      delete_hash: req.body.delete_hash,
    };

    try {
      const getProfileImage = await getProfileImageByID(id);

      if (getProfileImage.user_id !== decoded.user.id) {
        res.status(401).send("Unauthorized");
        return;
      } else if (!getProfileImage) {
        res.status(404).send("Profile image not found");
        return;
      }

      const updatedProfileImage = await updateProfileImage(
        id,
        updatedProfileImageData
      );
      console.log("=== PUT updated profile image", updatedProfileImage, "===");

      if (updatedProfileImage) {
        res.status(200).json({ payload: updatedProfileImage });
      } else {
        res.status(404).send("Profile image not updated");
      }
    } catch (error) {
      console.error("ERROR images.PUT /:id", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

images.delete(
  "/delete/:id",
  requireAuth(),
  scopeAuth(["write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const getProfileImage = await getProfileImageByID(id);

      if (getProfileImage.user_id !== decoded.user.id) {
        res.status(401).send("Unauthorized");
        return;
      } else if (!getProfileImage) {
        res.status(404).send("Profile image not found");
        return;
      }

      const deletedProfileImage = await deleteProfileImage(id);
      console.log("=== DELETE profile image", deletedProfileImage, "===");

      if (deletedProfileImage) {
        res.status(200).json({ payload: deletedProfileImage });
      } else {
        res.status(404).send("Profile image not deleted");
      }
    } catch (error) {
      console.error("ERROR images.DELETE /:id", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = images;
