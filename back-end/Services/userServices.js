import { createUser } from "../queries/usersQueries.js";
import { createToken } from "../validation/requireAuthv2.js";

export const registerUserAndSetCookies = async (newUserData, res) => {
  const createdUser = await createUser(newUserData);

  if (!createdUser) {
    throw new Error(
      "USER CREATION FAILED: Database operation did not return a user."
    );
  }

  const createdToken = await createToken(createdUser);

  if (!createdToken) {
    throw new Error(
      "TOKEN GENERATION FAILED: Could not generate authentication token."
    );
  }

  res.cookie("authToken", createdToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("authUser", createdUser, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
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

  return userData;
};
