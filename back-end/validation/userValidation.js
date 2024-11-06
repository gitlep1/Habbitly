const validator = require("validator");

const checkValues = (req, res, next) => {
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

module.exports = { checkValues };
