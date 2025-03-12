const validator = require("validator");

const checkUserValues = (req, res, next) => {
  const { username, password, email } = req.body;

  if (
    username &&
    password &&
    email &&
    username.trim() !== "" &&
    password.trim() !== "" &&
    email.trim() !== ""
  ) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    next();
  } else {
    res.status(400).json({
      error:
        "You are missing required keys. Please make sure you have: username, password, email",
    });
  }
};

const checkUserExtraEntries = (req, res, next) => {
  const validFields = ["username", "password", "email"];
  const keys = Object.keys(req.body);

  const extraFields = keys.filter((key) => !validFields.includes(key));

  if (extraFields.length > 0) {
    res.status(400).json({
      error: `You have extra keys: ${extraFields.join(", ")}.`,
    });
  } else {
    next();
  }
};

const checkProfileImageValues = (req, res, next) => {
  const { user_id } = req.body;

  if (user_id && user_id.trim() !== "") {
    next();
  } else {
    res.status(400).json({
      error:
        "You are missing required keys. Please make sure you have: user_id",
    });
  }
};

const checkProfileImageExtraEntries = (req, res, next) => {
  const validFields = ["user_id", "image_url", "delete_hash"];
  const keys = Object.keys(req.body);

  const extraFields = keys.filter((key) => !validFields.includes(key));

  if (extraFields.length > 0) {
    res.status(400).json({
      error: `You have extra keys: ${extraFields.join(", ")}.`,
    });
  } else {
    next();
  }
};

module.exports = {
  checkUserValues,
  checkUserExtraEntries,
  checkProfileImageValues,
  checkProfileImageExtraEntries,
};
