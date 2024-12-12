import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

const botName = "문화재 도우미";

const config = {
  initialMessages: [
    createChatBotMessage(`안녕하세요! ${botName}입니다.`),
    createChatBotMessage("문화재에 대해 궁금한 점을 물어보세요.", {
      withAvatar: true,
      delay: 500,
    }),
  ],
  state: {
    messages: [],
    isLoading: false,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#3B82F6",
    },
    chatButton: {
      backgroundColor: "#3B82F6",
    },
  },
  customComponents: {
    header: () => (
      <div className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">문화재 도우미</h1>
          <p className="text-sm opacity-80">
            문화재에 대해 궁금한 점을 물어보세요
          </p>
        </div>
      </div>
    ),
  },
};

export default config;
