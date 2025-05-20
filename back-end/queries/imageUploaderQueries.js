import { db } from "../db/dbConfig.js";

export const getAllProfileImages = async () => {
  const query = "SELECT * FROM profile_images";
  const images = await db.any(query);
  return images;
};

export const getProfileImageByID = async (id) => {
  const query = "SELECT * FROM profile_images WHERE id = $1";
  const image = await db.oneOrNone(query, [id]);

  if (!image) {
    return null;
  }

  return image;
};

export const createProfileImage = async (newProfileImageData) => {
  const query =
    "INSERT INTO profile_images (user_id, image_url, delete_hash) VALUES ($1, $2, $3) RETURNING image_url";
  const newImage = await db.oneOrNone(query, [
    newProfileImageData.user_id,
    newProfileImageData.image_url,
    newProfileImageData.delete_hash,
  ]);
  return newImage;
};

export const updateProfileImage = async (id, updatedProfileImageData) => {
  const query =
    "UPDATE profile_images SET image_url = $1, delete_hash = $2 WHERE id = $3 RETURNING image_url";
  const updatedImage = await db.oneOrNone(query, [
    updatedProfileImageData.image_url,
    updatedProfileImageData.delete_hash,
    id,
  ]);
  return updatedImage;
};

export const deleteProfileImage = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const query = "DELETE FROM profile_images WHERE id = $1 RETURNING image_url";
  const deletedImage = await db.oneOrNone(query, id);
  return deletedImage;
};
