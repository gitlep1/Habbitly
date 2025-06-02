import "./Stelly.scss";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Image, Button, Form } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import axios from "axios";

import { habitContext } from "../../CustomContexts/Contexts";
import { GetCookies, SetCookies } from "../../CustomFunctions/HandleCookies";

import StellyH from "../../assets/images/StellyHappy.png";
import StellyA from "../../assets/images/StellyAngry.png";

const STELLY_CHAT_HISTORY_KEY = "stelly_chat_history";

export const StellyAI = () => {
  const authUser = GetCookies("authUser");
  const authToken = GetCookies("authToken");

  const { userHabits, getUserHabits } = useContext(habitContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem(STELLY_CHAT_HISTORY_KEY);
      return savedMessages
        ? JSON.parse(savedMessages)
        : [
            {
              content:
                "Hello! I'm Stelly, your personal AI assistant. How can I help you today? *Parsed*",
              sender: "ai",
            },
          ];
    } catch (error) {
      console.error("Failed to parse chat history from localStorage:", error);
      return [
        {
          content:
            "Hello! I'm Stelly, your personal AI assistant. How can I help you today? *Not Parsed*",
          sender: "ai",
        },
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STELLY_CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMockAIResponse = useCallback((userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hi there! What's on your mind?";
    } else if (
      lowerCaseMessage.includes("habit") ||
      lowerCaseMessage.includes("goal")
    ) {
      return "I can help you with your habits and goals! What would you like to know?";
    } else if (lowerCaseMessage.includes("weather")) {
      return "I'm not connected to real-time weather data, but I hope it's sunny where you are!";
    } else if (lowerCaseMessage.includes("how are you")) {
      return "As an AI, I don't have feelings, but I'm ready to assist you!";
    } else if (
      lowerCaseMessage.includes("thank you") ||
      lowerCaseMessage.includes("thanks")
    ) {
      return "You're most welcome! Is there anything else I can do?";
    }
    return "That's an interesting question! Tell me more, or ask me about your habits.";
  }, []);

  const sendMessageToAI = useCallback(
    async (text) => {
      setIsLoading(true);
      try {
        // === MOCK API CALL ===
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockResponse = getMockAIResponse(text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: mockResponse, sender: "ai" },
        ]);
        // === END MOCK API CALL ===

        /*
      // === REAL AXIOS API CALL ===
      const messageData = {
        message: text,
        userId: authUser?.id
      }

      const response = await axios.post('/api/chat-with-stelly', messageData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: response.data.aiResponse, sender: "ai" }, // Assuming backend sends { aiResponse: "..." }
      ]);
      // === END REAL AXIOS API CALL ===
      */
      } catch (error) {
        console.error("Error sending message to AI:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: "Oops! I encountered an error. Please try again later.",
            sender: "ai",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [getMockAIResponse]
  );

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = inputValue.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: userMessage, sender: "user" },
      ]);
      setInputValue("");
      sendMessageToAI(userMessage);
    }
  }, [inputValue, isLoading, sendMessageToAI]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <>
      <div
        className={`
          stelly-chat-container transition-all duration-300 ease-in-out
          ${
            !isExpanded
              ? "collapsed cursor-pointer"
              : "w-full md:w-150 h-full md:h-full rounded-t-xl md:rounded-xl"
          }
        `}
        onClick={() => !isExpanded && setIsExpanded(true)}
        data-tooltip-id="stelly-ai-tooltip"
        data-tooltip-content="Stelly AI"
      >
        {!isExpanded && (
          <Image
            className="stelly-chat-icon"
            src={StellyH}
            alt="Stelly AI Icon"
          />
        )}

        {/* Expanded state: Full chatbox header and body */}
        {isExpanded && (
          <>
            <div
              className={`
                stelly-chat-header
                flex items-center
                font-semibold
                rounded-t-xl cursor-pointer
              `}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              <Image
                className="stelly-chat-header-img w-10 h-10 rounded-full mr-2 object-cover"
                src={isLoading ? StellyA : StellyH}
                alt={isLoading ? "Stelly Thinking" : "Stelly Happy"}
              />
              <h1 className="text-lg">Stelly</h1>
            </div>

            <div className="stelly-chat-body flex flex-col h-[calc(100%-60px)]">
              {/* Messages Display Area */}
              <div className="stelly-chat-messages flex-grow overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`
                      stelly-message
                      rounded-lg p-2 max-w-[75%]
                      ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white self-end ml-auto"
                          : "bg-gray-300 text-gray-800 self-start mr-auto"
                      }
                    `}
                  >
                    <p>{msg.content}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="stelly-message ai-message bg-gray-300 text-gray-800 rounded-lg p-2 max-w-[75%] self-start">
                    <p>Stelly is thinking...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Chat Input Area */}
              <div className="stelly-chat-input flex p-2 rounded-lg">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      {!isExpanded && (
        <Tooltip id="stelly-ai-tooltip" place="left" effect="solid" />
      )}
    </>
  );
};
