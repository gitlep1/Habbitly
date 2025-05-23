import post from "axios";
import { v2 as cloudinary } from "cloudinary";
import { fileTypeFromBuffer } from "file-type";

const ClientID = process.env.IMGUR_CLIENT_ID;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToImgur = async (fileBuffer) => {
  try {
    const imageBase64 = fileBuffer.toString("base64");

    const response = await post(
      "https://api.imgur.com/3/image",
      { image: imageBase64, type: "base64" },
      { headers: { Authorization: `Client-ID ${ClientID}` } }
    );

    console.log("uploadImageToImgur -> Imgur API Response:", response.data);

    return {
      image_url: response.data.data.link,
      delete_hash: response.data.data.deletehash,
    };
  } catch (error) {
    console.error("Error uploading to Imgur:", error);
    throw new Error("Image upload failed");
  }
};

export const uploadToCloudinary = async (fileBuffer) => {
  try {
    const type = await fileTypeFromBuffer(fileBuffer);

    if (!type) {
      throw new Error("Could not determine file type from buffer");
    }

    const dataUri = `data:${type.mime};base64,${fileBuffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "Habbitly",
      resource_type: "auto",
    });

    console.log("uploadToCloudinary -> Cloudinary API Response:", result);

    return {
      image_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};
