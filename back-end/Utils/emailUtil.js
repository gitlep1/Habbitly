const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL = process.env.GMAIL_EMAIL;
const EMAIL_PW = process.env.GMAIL_PW_PUB;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const createTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 587,
    auth: {
      user: EMAIL,
      pass: EMAIL_PW,
    },
  });
  // nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: EMAIL,
  //     clientId: CLIENT_ID,
  //     clientSecret: CLIENT_SECRET,
  //     refreshToken: REFRESH_TOKEN,
  //     accessToken: accessToken.token,
  //   },
  // });
};

module.exports = { createTransporter };
