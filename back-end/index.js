import express, { json, urlencoded } from "express";
import cors from "cors";
import { createServer } from "http";

import usersController from "./controllers/usersController.js";
import habbitsController from "./controllers/habbitsController.js";
import emailAuthController from "./controllers/emailAuthController.js";
import imageUploaderController from "./controllers/imageUploaderController.js";
import newsController from "./controllers/newsController.js";
import registeredCountController from "./controllers/registeredCountController.js";
import oauthRouter from "./Utils/oauthRoutes.js";

import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5173;

const allowedOrigins = [
  "http://localhost:5173",
  "https://habbitly.vercel.app",
  "https://habbitly.netlify.app",
  "http://localhost:4000",
  "https://habbitly-backend.vercel.app",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

if (process.env.ALLOW_OAUTH_SETUP === "true") {
  console.log("✅ OAuth setup routes are ENABLED.");
  app.use("/oauth", oauthRouter);
} else {
  console.log("OAuth setup routes are DISABLED.");
}

// === Account Routes === \\
app.use("/email", emailAuthController);
app.use("/users", usersController);

// === Habbit Routes === \\
app.use("/habbits", habbitsController);

// === Image Routes === \\
app.use("/images", imageUploaderController);

// === News Routes === \\
app.use("/news", newsController);

app.use("/registered-count", registeredCountController);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    res.send("✅ Login successful! Welcome, Admin.");
  } else {
    res.status(401).send("Invalid username or password.");
  }
});

app.get("/", (req, res) => {
  res.send(`
  <h1>HABBITLY</h1>

  <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" placeholder="username" required />

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" placeholder="password" required />

      <button type="submit">Submit</button>
    </form>
  `);
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send("GET OUT OF HERE OR HABBITLY WILL PULL YOU INTO ITS REALM!!!");
});

const server = createServer(app);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`✅ Habbitly is running on port ${PORT}`);

    if (process.env.ALLOW_OAUTH_SETUP === "true") {
      console.log(
        `Maps to http://localhost:${PORT}/oauth/authorize to perform initial Google OAuth authorization.`
      );
    }
  });
}

export default app;
