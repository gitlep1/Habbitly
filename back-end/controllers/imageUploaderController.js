import { Router } from "express";
const images = Router();
import multer, { memoryStorage } from "multer";
const upload = multer({ storage: memoryStorage() });

import {
  getAllProfileImages,
  getProfileImageByID,
  createProfileImage,
  updateProfileImage,
  deleteProfileImage,
} from "../queries/imageUploaderQueries.js";

import { getUserByID, updateUser } from "../queries/usersQueries.js";

import { checkProfileImageExtraEntries } from "../validation/entryValidation.js";
import { requireAuth } from "../validation/requireAuthv2.js";

import { uploadImageToImgur } from "../controllers/imageUploaderFunction.js";

images.get("/", requireAuth(), async (req, res) => {
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

images.get("/image/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const getProfileImage = await getProfileImageByID(id);
    console.log("=== GET profile image by ID", getProfileImage, "===");

    if (getProfileImage) {
      if (getProfileImage.user_id !== decodedUserData.id) {
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
});

images.post(
  "/upload",
  requireAuth(),
  upload.single("image"),
  async (req, res) => {
    const decodedUserData = req.user.decodedUser;

    try {
      const checkIfUserExists = await getUserByID(decodedUserData.id);

      if (!checkIfUserExists) {
        res.status(404).send("User not found");
        return;
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = req.file.buffer;
      const { image_url, delete_hash } = await uploadImageToImgur(fileBuffer);

      const newProfileImageData = {
        user_id: checkIfUserExists.id,
        image_url,
        delete_hash,
      };

      const createdProfileImage = await createProfileImage(newProfileImageData);
      console.log("=== POST new profile image", createdProfileImage, "===");

      if (createdProfileImage) {
        const updatedUser = {
          profileimg: createdProfileImage.image_url,
          username: checkIfUserExists.username,
          password: checkIfUserExists.password,
          email: checkIfUserExists.email,
          last_online: new Date(),
        };

        const updatedUserResult = await updateUser(
          checkIfUserExists.id,
          updatedUser
        );
        console.log("=== PUT updated user", updatedUserResult, "===");

        if (updatedUserResult) {
          res.status(200).json({ payload: updatedUserResult });
        } else {
          res.status(404).send("User profile image not updated");
        }
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
  checkProfileImageExtraEntries,
  async (req, res) => {
    const { id } = req.params;
    const decodedUserData = req.user.decodedUser;

    const updatedProfileImageData = {
      image_url: req.body.image_url,
      delete_hash: req.body.delete_hash,
    };

    try {
      const getProfileImage = await getProfileImageByID(id);

      if (getProfileImage.user_id !== decodedUserData.id) {
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

images.delete("/delete/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const getProfileImage = await getProfileImageByID(id);

    if (getProfileImage.user_id !== decodedUserData.id) {
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
});

export default images;
