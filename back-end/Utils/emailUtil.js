const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL = process.env.GMAIL_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const createTransporter = async () => {
  try {
    const accessTokenObj = await oAuth2Client.getAccessToken();
    if (!accessTokenObj || !accessTokenObj.token) {
      throw new Error("createTransporter -> Failed to retrieve access token");
    }

    console.log("✅ createTransporter -> Access Token Retrieved");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessTokenObj.token,
      },
    });

    await transporter.verify();
    console.log("✅ Transporter successfully verified");

    return transporter;
  } catch (error) {
    console.error(
      "❌ createTransporter -> Failed to create transporter:",
      error.message
    );
    return null;
  }
};

module.exports = { createTransporter };
