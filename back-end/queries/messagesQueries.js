import { db } from "../db/dbConfig.js";

export const getMessagesByConversationId = async (conversationId) => {
  const query = `
    SELECT 
      mess.id, 
      mess.content, 
      mess.sender, 
      mess.created_at, 
      mess.message_index
    FROM messages mess
    WHERE mess.conversation_id = $1
    ORDER BY mess.message_index ASC;
  `;

  const messages = await db.manyOrNone(query, [conversationId]);
  return messages;
};

export const createMessagesBatch = async (conversationId, messages) => {
  return db.tx(async (t) => {
    // Get current max index
    const { message_index: currentMaxIndex } = await t.oneOrNone(
      `SELECT COALESCE(MAX(message_index), 0) AS message_index FROM messages WHERE conversation_id = $1`,
      [conversationId]
    );

    // Add calculated index to each message
    const preparedMessages = messages.map((msg, i) => ({
      conversation_id: conversationId,
      content: msg.content,
      sender: msg.sender,
      message_index: currentMaxIndex + i + 1,
    }));

    // Prepare insert queries
    const inserts = preparedMessages.map((msg) =>
      t.none(
        `INSERT INTO messages (conversation_id, content, sender, message_index)
        VALUES ($1, $2, $3, $4)`,
        [msg.conversation_id, msg.content, msg.sender, msg.message_index]
      )
    );

    await t.batch(inserts);
    return preparedMessages;
  });
};

export const updateMessage = async (messageId, newContent) => {
  const query = `
    UPDATE messages
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `;

  const updatedMessage = await db.oneOrNone(query, [newContent, messageId]);
  return updatedMessage;
};
