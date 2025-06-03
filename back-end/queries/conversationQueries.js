import { db } from "../db/dbConfig.js";

export const getUsersConversations = async (userId) => {
  const query = `
    SELECT 
      convo.id,
      convo.title,
      convo.created_at,
      convo.updated_at,
      convo.is_saved,
      convo.last_message_at,
      COUNT(mess.id) AS message_count
    FROM conversations convo
    JOIN messages mess ON mess.conversation_id = convo.id
    WHERE convo.user_id = $1
    GROUP BY convo.id
    ORDER BY convo.updated_at DESC;
  `;

  const convos = await db.manyOrNone(query, [userId]);
  return convos;
};

export const getConversationById = async (conversationId) => {
  const query = `
    SELECT * FROM conversations
    WHERE id = $1;
  `;

  const convo = await db.oneOrNone(query, [conversationId]);
  return convo;
};

export const createConversation = async (userId, title) => {
  const query = `
    INSERT INTO conversations (user_id, title)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const newConvo = await db.one(query, [userId, title]);
  return newConvo;
};

export const updateConversationTitle = async (conversationId, newTitle) => {
  const query = `
    UPDATE conversations
    SET title = $1
    WHERE id = $2
    RETURNING *;
  `;

  const updatedConvo = await db.oneOrNone(query, [newTitle, conversationId]);
  return updatedConvo;
};

export const deleteConversation = async (conversationId) => {
  const query = `
    DELETE FROM conversations
    WHERE id = $1
    RETURNING *;
  `;

  const deletedConvo = await db.oneOrNone(query, [conversationId]);
  return deletedConvo;
};
