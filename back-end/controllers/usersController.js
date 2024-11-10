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
  checkIfUserExists,
} = require("../queries/usersQuerie");

const { checkValues } = require("../validation/userValidation");
const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const JSK = process.env.JWT_SECRET;

const DefaultProfImg = "../public/images/DefaultProfImg.png";

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
    console.error("users.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.get(
  "/user",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    let token = req.user.token || req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

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
    profileimg: req.body.profileimg,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  try {
    const checkCreds = await checkUserCredentials(
      newUserData.email,
      newUserData.username
    );

    if (checkCreds) {
      res.status(409).send("Email/Username already taken!");
    } else {
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

        res.status(201).json({ payload: userData, token });
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
  const { email, password } = req.body;

  try {
    const checkUser = await checkIfUserExists(email, password);

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

        res.status(201).json({ payload: userData, token });
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
    let token = req.user.token || req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.decode(token);

    try {
      const checkIfUserExists = await getUserByID(decoded.user.id);

      const updatedUserData = {
        profileimg: req.body.profileimg || checkIfUserExists.profileimg,
        username: req.body.username || checkIfUserExists.username,
        password: req.body.password || checkIfUserExists.password,
        email: req.body.email || checkIfUserExists.email,
        theme: req.body.theme || checkIfUserExists.theme,
        last_online: req.body.last_online || checkIfUserExists.last_online,
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
    let token = req.user.token || req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

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
