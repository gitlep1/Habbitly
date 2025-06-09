import { Router } from "express";
const oauthRouter = Router();
import { google } from "googleapis";
import "dotenv/config";

import { promises as fs } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI || "http://localhost:4000/oauth/oauth2callback";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://mail.google.com",
  "https://www.googleapis.com/auth/gmail.send",
];

const TEMP_TOKEN_PATH = join(__dirname, "temp_tokens_for_setup.json");

oauthRouter.get("/authorize", (req, res) => {
  if (process.env.ALLOW_OAUTH_SETUP !== "true") {
    return res.status(403).send("OAuth setup is not enabled.");
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

oauthRouter.get("/oauth2callback", async (req, res) => {
  if (process.env.ALLOW_OAUTH_SETUP !== "true") {
    return res.status(403).send("OAuth setup is not enabled.");
  }

  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not received.");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeFile(TEMP_TOKEN_PATH, JSON.stringify(tokens));

    // console.log("✅ Tokens acquired and saved temporarily:", tokens);

    res.send(`
      <h1>Authorization successful!</h1>
      <p>Your tokens, including the refresh token, have been saved to <code>${TEMP_TOKEN_PATH}</code> locally.</p>
    `);
  } catch (error) {
    console.error("❌ Error retrieving access token:", error);
    res.status(500).send("Failed to retrieve access token.");
  }
});

oauthRouter.get("/view-temp-tokens", async (req, res) => {
  if (process.env.ALLOW_OAUTH_SETUP !== "true") {
    return res.status(403).send("OAuth setup is not enabled.");
  }
  try {
    const tokens = await fs.readFile(TEMP_TOKEN_PATH);
    res.json(JSON.parse(tokens));
  } catch (error) {
    console.error("Error reading temporary tokens file:", error);
    res
      .status(500)
      .send(
        "Failed to read temporary tokens file (has the OAuth flow been completed?)."
      );
  }
});

export default oauthRouter;
