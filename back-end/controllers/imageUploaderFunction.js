const axios = require("axios");

const ClientID = process.env.IMGUR_CLIENT_ID;

const uploadImageToImgur = async (fileBuffer) => {
  try {
    const imageBase64 = fileBuffer.toString("base64");

    const response = await axios.post(
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

module.exports = { uploadImageToImgur };
