import { Router } from "express";
const emailAuth = Router();
import { createHash } from "crypto";

import { createTransporter } from "../Utils/emailUtil.js";
import { generateCode } from "../Utils/codeGenerator.js";

import {
  createEmailVerification,
  getEmailVerification,
  deleteEmailVerification,
} from "../queries/emailAuthQueries.js";

import { checkUserCredentials } from "../queries/usersQueries.js";

import { getUserByID } from "../queries/usersQueries.js";

emailAuth.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const emailVerification = await getEmailVerification(email);

    if (!emailVerification) {
      return res.status(400).json({ message: "Invalid email or code." });
    }

    const { code: storedHashedCode, created_at } = emailVerification;
    const expiresAt = new Date(new Date(created_at).getTime() + 5 * 60 * 1000);

    const hashedInputCode = createHash("sha256").update(code).digest("hex");

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
    username: req.body.username,
  };

  try {
    const userExists = await checkUserCredentials(userData, "email|username");
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email or Username already exists." });
    }

    const emailVerification = await getEmailVerification(userData.email);
    if (emailVerification) {
      await deleteEmailVerification(userData.email);
    }

    const transporter = await createTransporter();
    const code = generateCode();

    if (!transporter) {
      console.error(
        `Error: Transporter was not created. Transported returned: ${transporter}`
      );
      return res
        .status(500)
        .json({ error: "Failed to create email transporter." });
    }

    const hashedCode = createHash("sha256").update(code).digest("hex");

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
        success:
          "Verification code has been sent to the specified email address.",
      });
    } else {
      res.status(500).json({ error: "Failed to create email verification." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send verification code." });
  }
});

emailAuth.post("/forgot-password", async (req, res) => {
  const userEmailData = {
    email: req.body.email,
  };

  const checkIfEmailExists = await checkUserCredentials(userEmailData, "email");

  console.log("Check if email exists:", checkIfEmailExists);

  if (!checkIfEmailExists) {
    return res.status(404).json({ error: "Email not found." });
  }

  try {
    const userData = await getUserByID(checkIfEmailExists.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found." });
    }

    if (userEmailData.email !== userData.email) {
      return res
        .status(400)
        .json({ error: "Email does not match the specified account." });
    }

    const transporter = await createTransporter();
    const mailOptions = {
      from: `Habbitly <${process.env.EMAIL}>`,
      to: userData.email,
      subject: "Habbitly forgot password",
      text: `Your password is : ${userData.password}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: "Password has been sent to the specified email address.",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ error: "Failed to send password." });
  }
});

export default emailAuth;
