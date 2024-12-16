import { createChatBotMessage } from "react-chatbot-kit";
import logo_w from "../../assets/logo_w.png";

const config = {
  initialMessages: [createChatBotMessage("안녕하세요! 무엇을 도와드릴까요?")],
  botName: "Chatbot",
  customComponents: {
    header: () => (
      <div className="react-chatbot-kit-chat-header">유산지기 AI 챗봇</div>
    ),
    botAvatar: () => (
      <img
        src={logo_w}
        alt="챗봇 아바타"
        className="react-chatbot-kit-chat-bot-avatar bg-blue-900 "
      />
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
