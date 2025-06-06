import "./Stelly.scss";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Image, Button, Form } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";

import { habitContext } from "../../CustomContexts/Contexts";
import { GetCookies, SetCookies } from "../../CustomFunctions/HandleCookies";

import StellyH from "../../assets/images/StellyHappy.png";
import StellyA from "../../assets/images/StellyAngry.png";

const API = import.meta.env.VITE_PUBLIC_API_BASE;

const STELLY_CHAT_HISTORY_KEY = "stelly_chat_history";

export const StellyAI = () => {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const authToken = GetCookies("authToken");

  const { userHabits, getUserHabits } = useContext(habitContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState(getSavedMessages);

  function getSavedMessages() {
    try {
      const saved = localStorage.getItem(STELLY_CHAT_HISTORY_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              sender: "model",
              content:
                "Hello! I'm Stelly, your personal AI assistant. How can I help you today?",
            },
          ];
    } catch (err) {
      console.error("Corrupt chat history in localStorage:", err);
      return [
        {
          sender: "model",
          content:
            "Hello! I'm Stelly, your personal AI assistant. How can I help you today?",
        },
      ];
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem(STELLY_CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  const resetTextareaHeight = useCallback(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el?.resize?.();
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();

      setTimeout(() => {
        resetTextareaHeight();
      }, 50);
    }
  }, [messages, isExpanded, resetTextareaHeight]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageToAI = useCallback(
    async (text) => {
      setIsLoading(true);
      try {
        const messageData = {
          message: text,
          chatHistory: messages.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
          })),
        };

        await axios
          .post(`${API}/stelly`, messageData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          })
          .then((res) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: "model", content: res.data.payload },
            ]);
          })
          .catch((err) => {
            console.error("Error from Stelly AI API:", err);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: "model",
                content:
                  "Oops! I encountered an error. Please try again later.",
              },
            ]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error sending message to AI:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "model",
            content: "Oops! I encountered an error. Please try again later.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, authToken]
  );

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = inputValue.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: userMessage },
      ]);
      setInputValue("");
      sendMessageToAI(userMessage);
    }
  }, [inputValue, isLoading, sendMessageToAI]);

  return (
    <>
      <div
        className={`
          stelly-chat-container transition-all duration-300 ease-in-out
          ${
            !isExpanded
              ? "collapsed cursor-pointer"
              : "w-full md:w-115 h-full md:h-full rounded-t-xl md:rounded-xl"
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
                flex justify-between items-center
                font-semibold
                rounded-t-xl cursor-pointer
              `}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              <div className="flex items-center">
                <Image
                  className="stelly-chat-header-img w-15 h-15 rounded-full mr-2 object-cover"
                  src={isLoading ? StellyA : StellyH}
                  alt={isLoading ? "Stelly Thinking" : "Stelly Happy"}
                />
                <h1 className="text-lg">Stelly</h1>
              </div>
              <Button
                className="stelly-chat-close-btn"
                variant="outline-secondary"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                X
              </Button>
            </div>

            <div className="stelly-chat-body flex flex-col h-[calc(100%-60px)]">
              {/* Messages Display Area */}
              <div className="stelly-chat-messages flex-grow overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`
                      stelly-message
                      ${
                        msg.sender === "user"
                          ? "bg-gray-500 text-white rounded-lg p-2 max-w-[65%] self-end ml-auto"
                          : "prose prose-sm dark:prose-invert max-w-full self-start"
                      }
                    `}
                  >
                    {msg.sender === "user" ? (
                      <p>{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="stelly-message ai-message prose prose-sm dark:prose-invert max-w-full self-start">
                    <p>Stelly is thinking...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Chat Input Area */}
              <div className="chat-input-container relative w-full">
                <TextareaAutosize
                  ref={inputRef}
                  minRows={2}
                  maxRows={6}
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="stelly-input-box w-full resize-none rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  ➤
                </button>
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
