const express = require("express");
const emailAuth = express.Router();
const crypto = require("crypto");

const { createTransporter } = require("../Utils/emailUtil");
const { generateCode } = require("../Utils/codeGenerator");

const {
  createEmailVerification,
  getEmailVerification,
  deleteEmailVerification,
} = require("../Queries/emailAuthQueries");

const { checkUserCredentials } = require("../Queries/usersQueries");

emailAuth.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const emailVerification = await getEmailVerification(email);

    if (!emailVerification) {
      return res.status(400).json({ message: "Invalid email or code." });
    }

    const { code: storedHashedCode, created_at } = emailVerification;
    const expiresAt = new Date(new Date(created_at).getTime() + 5 * 60 * 1000);

    const hashedInputCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    if (hashedInputCode !== storedHashedCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (new Date() > expiresAt) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    await deleteEmailVerification(email);

    res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify the code." });
  }
});

emailAuth.post("/send-verification", async (req, res) => {
  const userData = {
    email: req.body.email,
  };

  try {
    const userExists = await checkUserCredentials(userData, "email");
    if (userExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const transporter = await createTransporter();
    const code = generateCode();

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const createdEmailAuth = await createEmailVerification(
      userData.email,
      hashedCode
    );

    const mailOptions = {
      from: `Habbitly <${process.env.EMAIL}>`,
      to: userData.email,
      subject: "Habbitly Verification Code",
      text: `Your verification code is: ${code}`,
    };

    if (createdEmailAuth) {
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message:
          "Verification code has been sent to the specified email address.",
      });
    } else {
      res.status(500).json({ message: "Failed to create email verification." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send verification code." });
  }
});

module.exports = emailAuth;
