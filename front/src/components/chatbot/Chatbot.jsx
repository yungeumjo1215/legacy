import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./Chatbot.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const Chat = () => {
  return (
    <div className="back">
      <div className="chat-wrapper">
        <div className="chat-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            placeholderText="메시지를 입력하세요..."
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
