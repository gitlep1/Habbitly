const express = require("express");
const jwt = require("jsonwebtoken");
const users = express.Router();

const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
} = require("../queries/usersQueries");

const { checkValues } = require("../validation/userValidation");
const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const defaultImg = "../images/default.png";

const JSK = process.env.JWT_SECRET;

users.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    console.log("=== GET all users", allUsers, "===");

    if (allUsers) {
      res.status(200).json({ payload: allUsers });
    } else {
      res.status(404).send("Cannot find any users");
    }
  } catch (error) {
    console.error("ERROR users.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.get(
  "/user",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const getAUser = await getUserByID(decoded.user.id);

      if (getAUser) {
        console.log("=== GET user by ID", getAUser, "===");

        const userData = {
          id: getAUser.id,
          profileimg: getAUser.profileimg,
          username: getAUser.username,
          theme: getAUser.theme,
          last_online: getAUser.last_online,
        };

        res.status(200).json({ payload: userData });
      } else {
        res.status(404).send("user not found");
      }
    } catch (error) {
      console.error("users.GET /user", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

users.post("/signup", checkValues, async (req, res) => {
  const newUserData = {
    profileimg: defaultImg,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  console.log("=== POST (newUserData)", newUserData, "===");

  try {
    const checkCreds = await checkUserCredentials(
      newUserData,
      "email&username"
    );

    console.log("=== POST user signup (checkCreds)", checkCreds, "===");

    if (checkCreds) {
      res.status(409).send("Email/Username already taken!");
    } else {
      newUserData.profileimg;
      const createdUser = await createUser(newUserData);

      if (createdUser) {
        const clientTokenPayload = {
          user: createdUser,
          scopes: ["read:user", "write:user"],
        };
        console.log(
          "=== POST user signup (clientTokenPayload)",
          clientTokenPayload,
          "==="
        );
        const token = jwt.sign(clientTokenPayload, JSK, {
          expiresIn: "30d",
        });

        const userData = {
          id: createdUser.id,
          profileimg: createdUser.profileimg,
          username: createdUser.username,
          theme: createdUser.theme,
          last_online: createdUser.last_online,
        };

        res.status(200).json({ payload: userData, token });
      } else {
        res.status(404).send("user not created");
      }
    }
  } catch (error) {
    console.error("users.POST /signup", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.post("/signin", async (req, res) => {
  const existingUserData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const checkUser = await checkUserCredentials(
      existingUserData,
      "email&password"
    );

    if (checkUser) {
      const getUserData = await getUserByID(checkUser.id);

      if (getUserData) {
        const clientTokenPayload = {
          user: getUserData,
          scopes: ["read:user", "write:user"],
        };
        console.log(
          "=== POST user signin (clientTokenPayload)",
          clientTokenPayload,
          "==="
        );
        const token = jwt.sign(clientTokenPayload, JSK, {
          expiresIn: "30d",
        });

        const userData = {
          id: getUserData.id,
          profileimg: getUserData.profileimg,
          username: getUserData.username,
          theme: getUserData.theme,
          last_online: getUserData.last_online,
        };

        res.status(200).json({ payload: userData, token });
      } else {
        res.status(404).send(`Data for: ${checkUser.id} not found`);
      }
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    console.error("users.POST /signin", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.put(
  "/update",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);
    const { profileimg, username, password, email, theme, last_online } =
      req.body;

    try {
      const checkIfUserExists = await getUserByID(decoded.user.id);

      const updatedUserData = {
        profileimg: profileimg || checkIfUserExists.profileimg,
        username: username || checkIfUserExists.username,
        password: password || checkIfUserExists.password,
        email: email || checkIfUserExists.email,
        theme: theme || checkIfUserExists.theme,
        last_online: last_online || checkIfUserExists.last_online,
      };

      const updatedUser = await updateUser(
        checkIfUserExists.id,
        updatedUserData
      );

      if (updatedUser) {
        console.log("=== PUT user", updatedUser, "===");
        res.status(200).json({ payload: updatedUser });
      } else {
        res.status(404).send("user not found");
      }
    } catch (error) {
      console.error("users.PUT /update", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

users.delete(
  "/delete",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const deletedUser = await deleteUser(decoded.user.id);

      if (deletedUser) {
        console.log("=== DELETE user", deletedUser, "===");
        res.status(200).send(
          `
          ID: ${deletedUser.id}
          User: ${deletedUser.username} 
          SUCCESS: user has been deleted.
        `
        );
      } else {
        res.status(404).send(
          `
          ID: ${decoded.user.id} 
          User: ${decoded.user.username}
          ERROR: user does not exist.
        `
        );
      }
    } catch (error) {
      console.error("users.DELETE /delete", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = users;
