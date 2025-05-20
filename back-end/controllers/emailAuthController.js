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

import { registerUserAndSetCookies } from "../Services/userServices.js";

emailAuth.post("/verify-code", async (req, res) => {
  const { email, code, username, password } = req.body;

  const checkCreds = await checkUserCredentials(newUserData, "email&username");

  console.log("=== POST verify-code (checkCreds)", checkCreds, "===");

  if (checkCreds) {
    return res.status(409).send("Email/Username already taken!");
  }

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

    const userData = {
      email,
      username,
      password,
    };

    await registerUserAndSetCookies(userData, res);

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
      return res.status(400).json({ error: "Email already exists." });
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

export default emailAuth;
