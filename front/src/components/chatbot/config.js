import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  initialMessages: [createChatBotMessage("안녕하세요! 무엇을 도와드릴까요?")],
  botName: "Chatbot",
  customComponents: {
    header: () => (
      <div className="react-chatbot-kit-chat-header">유산지기 AI 챗봇</div>
    ),
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
    loadingDots: {
      color: "#376B7E",
      backgroundColor: "#376B7E",
    },
  },
};

export default config;
