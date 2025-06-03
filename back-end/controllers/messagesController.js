import { Router } from "express";
const messages = Router();

import {
  getMessagesByConversationId,
  createMessagesBatch,
  updateMessage,
} from "../queries/messagesQueries.js";

import { requireAuth } from "../validation/requireAuthv2.js";

messages.get("/:conversationId", requireAuth(), async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messagesList = await getMessagesByConversationId(conversationId);

    if (messagesList) {
      res.status(200).json({ payload: messagesList });
    } else {
      res.status(404).send("No messages found for this conversation");
    }
  } catch (error) {
    console.error("ERROR messages.GET /:conversationId", { error });
    res.status(500).send("Internal Server Error");
  }
});

messages.post("/", requireAuth(), async (req, res) => {
  const { conversationId, messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).send("Messages must be a non-empty array.");
  }

  try {
    const newMessages = await createMessagesBatch(conversationId, messages);

    if (newMessages?.length) {
      res.status(201).json({ payload: newMessages });
    } else {
      res.status(400).send("Failed to save messages.");
    }
  } catch (error) {
    console.error("ERROR messages.POST /", { error });
    res.status(500).send("Internal Server Error");
  }
});

messages.put("/:messageId", requireAuth(), async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const updatedMessage = await updateMessage(messageId, content);

    if (updatedMessage) {
      res.status(200).json({ payload: updatedMessage });
    } else {
      res.status(404).send("Message not found");
    }
  } catch (error) {
    console.error("ERROR messages.PUT /:messageId", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default messages;
