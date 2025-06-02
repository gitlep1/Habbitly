import "./Stelly.scss";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Image } from "react-bootstrap";

import { habitContext } from "../../CustomContexts/Contexts";
import { GetCookies, SetCookies } from "../../CustomFunctions/HandleCookies";

import StellyH from "../../assets/images/StellyHappy.png";
import StellyA from "../../assets/images/StellyAngry.png";

export const StellyAI = () => {
  const authUser = GetCookies("authUser");
  const { userHabits, getUserHabits } = useContext(habitContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      content:
        "Hello! I'm Stelly, your personal AI assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="stelly-chat-container">
      <div className="stelly-chat-header flex items-center">
        <Image
          className="stelly-chat-header-img"
          src={StellyH}
          alt="Stelly Happy"
        />
        <h1>Stelly AI</h1>
      </div>
      <div className="stelly-chat-body">
        <div className="stelly-chat-body-content">
          <p>
            Hello! I'm Stelly, your personal AI assistant. I'm here to help you
          </p>
        </div>
      </div>
    </div>
  );
};
