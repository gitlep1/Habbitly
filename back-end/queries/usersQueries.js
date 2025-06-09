import { db } from "../db/dbConfig.js";

export const getAllUsers = async () => {
  const query = "SELECT profileimg, username, theme, last_online FROM users";
  const users = await db.any(query);
  return users;
};

export const getUserByID = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const user = await db.oneOrNone(query, [id]);

  if (!user) {
    return null;
  }

  return user;
};

export const createUser = async (newUserData) => {
  const query =
    "INSERT INTO users (username, password, email, created_at) VALUES ($1, $2, $3, NOW())  RETURNING id, profileimg, username, email, about_me, theme, last_online";
  const newUser = await db.oneOrNone(query, [
    newUserData.username,
    newUserData.password,
    newUserData.email,
  ]);
  return newUser;
};

export const updateUser = async (id, updatedUserData) => {
  const query =
    "UPDATE users SET profileimg = $1, username = $2, password = $3, email = $4, theme = $5, updated_at = NOW(), last_online = $6, about_me = $7 WHERE id = $8 RETURNING id, profileimg, username, email, about_me, theme, last_online";
  const updateUser = await db.oneOrNone(query, [
    updatedUserData.profileimg,
    updatedUserData.username,
    updatedUserData.password,
    updatedUserData.email,
    updatedUserData.theme,
    updatedUserData.last_online,
    updatedUserData.about_me,
    id,
  ]);
  return updateUser;
};

export const deleteUser = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const query =
    "DELETE FROM users WHERE id = $1 RETURNING id, profileimg, username";
  const deletedUser = await db.oneOrNone(query, id);
  return deletedUser;
};

export const checkUserCredentials = async (userData, checker) => {
  let query = "SELECT id FROM users WHERE ";
  const params = [];
  const conditions = [];

  if (checker.includes("email") && userData.email) {
    params.push(userData.email);
    conditions.push(`email = $${params.length}`);
  }

  if (checker.includes("username") && userData.username) {
    params.push(userData.username);
    conditions.push(`username = $${params.length}`);
  }

  if (checker.includes("password") && userData.password) {
    params.push(userData.password);
    conditions.push(`password = $${params.length}`);
  }

  if (conditions.length === 0) return null;

  const joiner = checker === "email|username" ? " OR " : " AND ";
  query += conditions.join(joiner);

  const userCredentials = await db.oneOrNone(query, params);
  return userCredentials;
};
