const express = require("express");
const cors = require("cors");
const http = require("http");
const multer = require("multer");
const upload = multer();

const usersController = require("./controllers/usersController");
const habbitsController = require("./controllers/habbitsController");
const emailAuthController = require("./controllers/emailAuthController");
const imageUploaderController = require("./controllers/imageUploaderController");
const newsController = require("./controllers/newsController");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5173;

const allowedOrigins = [
  "http://localhost:5173",
  "https://habbitly.vercel.app",
  "http://localhost:4000",
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.any());

// === Account Routes === \\
app.use("/email", emailAuthController);
app.use("/users", usersController);

// === Habbit Routes === \\
app.use("/habbits", habbitsController);

// === Image Routes === \\
app.use("/images", imageUploaderController);

// === News Routes === \\
app.use("/news", newsController);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    res.send("Login successful! Welcome, Admin.");
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

const server = http.createServer(app);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Habbitly is running on port ${PORT}`);
  });
}

module.exports = app;
