import { Router } from "express";
const users = Router();

import {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
} from "../queries/usersQueries.js";

import {
  getRegisteredCount,
  updateRegisteredCount,
} from "../queries/registeredCountQueries.js";

import {
  checkUserValues,
  checkUserExtraEntries,
} from "../validation/entryValidation.js";
import { createToken, requireAuth } from "../validation/requireAuthv2.js";

users.get("/", requireAuth(), async (req, res) => {
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

users.get("/user", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  try {
    const getAUser = await getUserByID(decodedUserData.id);

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
});

users.post(
  "/signup",
  checkUserValues,
  checkUserExtraEntries,
  async (req, res) => {
    const newUserData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };

    console.log("=== POST (newUserData)", newUserData, "===");

    try {
      const checkCreds = await checkUserCredentials(
        newUserData,
        "email|username"
      );

      console.log("=== POST user signup (checkCreds)", checkCreds, "===");

      if (checkCreds) {
        return res.status(409).send("Email/Username already taken!");
      }
      const createdUser = await createUser(newUserData);

      if (!createdUser) {
        return res.status(404).send("user not created");
      }

      const createdToken = await createToken(createdUser);

      if (!createdToken) {
        return res.status(404).send("token not created");
      }

      res.cookie("authToken", createdToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie("authUser", JSON.stringify(createdUser), {
        httpOnly: false,
        secure: true,
        sameSite: "None",
        partitioned: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const userData = {
        id: createdUser.id,
        profileimg: createdUser.profileimg,
        email: createdUser.email,
        username: createdUser.username,
        theme: createdUser.theme,
        last_online: createdUser.last_online,
      };

      const registeredCount = await getRegisteredCount();
      const newCount = registeredCount?.count + 1;
      await updateRegisteredCount(newCount, registeredCount.id);
      res.status(200).json({ payload: userData });
    } catch (error) {
      console.error("users.POST /signup", { error });
      res.status(500).send("Internal Server Error");
    }
  }
);

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

      if (!getUserData) {
        return res.status(404).send("user not found");
      }

      const userData = {
        id: getUserData.id,
        profileimg: getUserData.profileimg,
        username: getUserData.username,
        theme: getUserData.theme,
        last_online: getUserData.last_online,
      };

      const createdToken = await createToken(userData);

      if (!createdToken) {
        return res.status(404).send("token not created");
      }

      console.log("=== POST user signin (tokenData)", createdToken, "===");

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      res.cookie("authToken", createdToken, {
        expires: expirationDate,
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "None",
        partitioned: true,
      });

      res.cookie("authUser", JSON.stringify(userData), {
        expires: expirationDate,
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "None",
        partitioned: true,
      });

      console.log("=== POST user signin", userData, "===");
      res.status(200).json({ payload: userData, token: createdToken });
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    console.error("users.POST /signin", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.post("/signout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    partitioned: true,
    path: "/",
  });

  res.clearCookie("authUser", {
    httpOnly: false,
    secure: true,
    sameSite: "None",
    partitioned: true,
    path: "/",
  });

  res.status(200).json({ payload: "Signed out successfully" });
});

users.put("/update", requireAuth(), checkUserExtraEntries, async (req, res) => {
  const decodedUserData = req.user.decodedUser;
  const { profileimg, username, password, email, theme, last_online } =
    req.body;

  try {
    const existingUser = await getUserByID(decodedUserData.id);

    if (!existingUser) {
      return res.status(404).send("user not found");
    }

    const updatedUserData = {
      profileimg: profileimg || existingUser.profileimg,
      username: username || existingUser.username,
      password: password || existingUser.password,
      email: email || existingUser.email,
      theme: theme || existingUser.theme,
      last_online: last_online || existingUser.last_online,
    };

    const updatedUser = await updateUser(userId, updatedUserData);

    if (!updatedUser) {
      return res.status(404).send("user not updated");
    }

    const createdToken = await createToken(updatedUser);

    if (!createdToken) {
      return res.status(404).send("token not created");
    }

    res.cookie("authToken", createdToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      partitioned: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("authUser", updatedUser, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
      partitioned: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    console.log("=== PUT user", updatedUser, "===");
    res.status(200).json({ payload: updatedUser });
  } catch (error) {
    console.error("users.PUT /update", { error });
    res.status(500).send("Internal Server Error");
  }
});

users.delete("/delete", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  try {
    const deletedUser = await deleteUser(decodedUserData.id);

    if (deletedUser) {
      console.log("=== DELETE user", deletedUser, "===");

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned: true,
        path: "/",
      });
      res.clearCookie("authUser", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
      });

      res.status(200).send(
        `
          ID: ${deletedUser.id}
          User: ${deletedUser.user} 
          SUCCESS: user has been deleted.
        `
      );
    } else {
      res.status(404).send(
        `
          ID: ${deletedUser.id} 
          User: ${deletedUser.username}
          ERROR: user does not exist.
        `
      );
    }
  } catch (error) {
    console.error("users.DELETE /delete", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default users;
