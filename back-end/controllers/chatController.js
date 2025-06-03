import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { requireAuth } from "../validation/requireAuthv2.js";

const chat = Router();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "GOOGLE_GEMINI_API_KEY is required for AI chat functionality."
  );
}

const GEMINI_MODEL = "gemini-1.5-flash";

const AI_SYSTEM_PROMPT =
  "You are Stelly, a helpful AI assistant. Your primary role is to assist users with their positive habits and goals. You are not a therapist, doctor, or medical professional, and you do not provide medical, psychological, or legal advice. Focus on encouraging and supporting users in their journey to build good habits and achieve their objectives.";

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

chat.post("/", requireAuth(), async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const historyForSDK = (chatHistory || []).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chatSession = genAI.chats.create({
      model: GEMINI_MODEL,
      history: historyForSDK,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT,
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chatSession.sendMessage({ message });
    const StellyResponse =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I wasn't able to process that. Can you rephrase?";

    res.status(200).json({
      payload: StellyResponse,
    });
  } catch (err) {
    console.error("Gemini SDK Error:", err);
    res.status(500).json({ err: "Failed to generate AI response." });
  }
});

export default chat;
