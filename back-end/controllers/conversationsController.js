import { Router } from "express";
const conversations = Router();

import {
  getUsersConversations,
  getConversationById,
  createConversation,
  updateConversationTitle,
  deleteConversation,
} from "../queries/conversationQueries.js";

import { requireAuth } from "../validation/requireAuthv2.js";

conversations.get("/", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;

  try {
    const conversationsList = await getUsersConversations(decodedUserData.id);

    if (conversationsList) {
      res.status(200).json({ payload: conversationsList });
    } else {
      res.status(404).send("No conversations found");
    }
  } catch (error) {
    console.error("ERROR conversations.GET /", { error });
    res.status(500).send("Internal Server Error");
  }
});

conversations.get("/:conversationId", requireAuth(), async (req, res) => {
  const { conversationId } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const conversation = await getConversationById(conversationId);

    if (decodedUserData.id !== conversation?.user_id) {
      return res
        .status(403)
        .send("Forbidden: You do not have access to this conversation");
    }

    if (conversation) {
      res.status(200).json({ payload: conversation });
    } else {
      res.status(404).send("Conversation not found");
    }
  } catch (error) {
    console.error("ERROR conversations.GET /:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

conversations.post("/", requireAuth(), async (req, res) => {
  const decodedUserData = req.user.decodedUser;
  const { title } = req.body;

  try {
    const newConversation = await createConversation(decodedUserData.id, title);

    if (newConversation) {
      res.status(201).json({ payload: newConversation });
    } else {
      res.status(400).send("Failed to create conversation");
    }
  } catch (error) {
    console.error("ERROR conversations.POST /", { error });
    res.status(500).send("Internal Server Error");
  }
});

conversations.put("/:conversationId", requireAuth(), async (req, res) => {
  const { conversationId } = req.params;
  const { title } = req.body;
  const decodedUserData = req.user.decodedUser;

  try {
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).send("Conversation not found");
    }

    if (decodedUserData.id !== conversation.user_id) {
      return res
        .status(403)
        .send("Forbidden: You do not have access to update this conversation");
    }

    const updatedConversation = await updateConversationTitle(
      conversationId,
      title
    );

    if (updatedConversation) {
      res.status(200).json({ payload: updatedConversation });
    } else {
      res.status(404).send("Conversation not found or update failed");
    }
  } catch (error) {
    console.error("ERROR conversations.PUT /:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

conversations.delete("/:conversationId", requireAuth(), async (req, res) => {
  const { conversationId } = req.params;
  const decodedUserData = req.user.decodedUser;

  try {
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).send("Conversation not found");
    }

    if (decodedUserData.id !== conversation.user_id) {
      return res
        .status(403)
        .send("Forbidden: You do not have access to delete this conversation");
    }

    const deletedConversation = await deleteConversation(conversationId);

    if (deletedConversation) {
      res.status(200).json({ payload: deletedConversation });
    } else {
      res.status(404).send("Conversation not found or deletion failed");
    }
  } catch (error) {
    console.error("ERROR conversations.DELETE /:id", { error });
    res.status(500).send("Internal Server Error");
  }
});

export default conversations;
