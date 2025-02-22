const { db } = require("../db/dbConfig.js");

const createEmailVerification = async (email, code) => {
  const query =
    "INSERT INTO email_verification (email, code) VALUES ($1, $2) RETURNING *";
  const newEmailVerification = await db.one(query, [email, code]);
  return newEmailVerification;
};

const getEmailVerification = async (email) => {
  const query = "SELECT * FROM email_verification WHERE email = $1";
  const emailVerification = await db.oneOrNone(query, email);
  return emailVerification;
};

const deleteEmailVerification = async (email) => {
  const query = "DELETE FROM email_verification WHERE email = $1";
  await db.none(query, email);
};

module.exports = {
  createEmailVerification,
  getEmailVerification,
  deleteEmailVerification,
};
