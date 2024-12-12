import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";
import "./Chat.css";

const Chat = () => {
  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText="메시지를 입력하세요..."
      />
    </div>
  );
};

export default Chat;
