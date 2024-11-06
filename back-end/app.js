const express = require("express");
const cors = require("cors");

const usersController = require("./controllers/userController");

require("dotenv").config();

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:4000"];

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

// === Account Routes === \\
app.use("/users", usersController);

app.get("/", (req, res) => {
  res.send(`
  <h1>HABBITLY</h1>

  <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username">

      <label for="password">Password:</label>
      <input type="password" id="password" name="password">

      <button type="submit">Submit</button>
    </form>
  `);
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send("GET OUT OF HERE OR HABBITLY WILL PULL YOU INTO ITS REALM!!!");
});

module.exports = app;
