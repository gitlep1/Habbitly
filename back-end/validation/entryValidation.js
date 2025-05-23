import validator from "validator";

export const checkUserValues = (req, res, next) => {
  const { username, password, email } = req.body;

  const trimmedUsername = username?.trim() ?? "";
  const trimmedPassword = password?.trim() ?? "";
  const trimmedEmail = email?.trim() ?? "";

  if (trimmedUsername && trimmedPassword && trimmedEmail) {
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

const createExtraEntryChecker = (validFields) => {
  return (req, res, next) => {
    const keys = Object.keys(req.body || {});
    const extraFields = keys.filter((key) => !validFields.includes(key));

    if (extraFields.length > 0) {
      return res.status(400).json({
        error: `You have extra keys: ${extraFields.join(", ")}.`,
      });
    }

    next();
  };
};

export const checkUserExtraEntries = createExtraEntryChecker([
  "username",
  "password",
  "email",
  "about_me",
  "theme",
]);

export const checkProfileImageExtraEntries = createExtraEntryChecker([
  "user_id",
  "image_url",
  "delete_hash",
]);
