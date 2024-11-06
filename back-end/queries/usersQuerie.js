const db = require("../db/dbConfig.js");

const getAllUsers = async () => {
  const users = await db.any(
    "SELECT profileimg, username, theme, last_online FROM users"
  );
  return users;
};

const getUserByID = async (id) => {
  const user = await db.oneOrNone("SELECT * FROM users WHERE users.id = $1", [
    id,
  ]);

  if (!user) {
    return null;
  }

  return user;
};

const createUser = async (newUserData) => {
  const newUser = await db.oneOrNone(
    "INSERT INTO users (profileimg, username, password, email) VALUES($1, $2, $3, $4) RETURNING *",
    [
      newUserData.profileimg,
      newUserData.username,
      newUserData.password,
      newUserData.email,
    ]
  );
  return newUser;
};

const updateUser = async (id, updatedUserData) => {
  const updateUser = await db.oneOrNone(
    "UPDATE users SET profileimg = $1, username = $2, password = $3, email = $4, theme = $5, last_online = $13 WHERE id = $14 RETURNING *",
    [
      updatedUserData.profileimg,
      updatedUserData.username,
      updatedUserData.password,
      updatedUserData.email,
      updatedUserData.theme,
      updatedUserData.last_online,
      id,
    ]
  );
  return updateUser;
};

const deleteUser = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const deletedUser = await db.oneOrNone("DELETE FROM users WHERE id = $1", id);
  return deletedUser;
};

const checkUserCredentials = async (email, username) => {
  const userCredentials = await db.oneOrNone(
    "SELECT id FROM users WHERE email = $1 AND username = $2",
    [email, username]
  );
  return userCredentials ? true : false;
};

const checkIfUserExists = async (email, password) => {
  const userExists = await db.oneOrNone(
    "SELECT id FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  return userExists;
};

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
  checkIfUserExists,
};
