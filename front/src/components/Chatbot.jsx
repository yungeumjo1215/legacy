import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message: inputMessage,
      });

      // 챗봇 응답 추가
      const botMessage = {
        type: "bot",
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("챗봇 응답 오류:", error);

      // 에러 메시지 추가
      const errorMessage = {
        type: "bot",
        content: "죄송합니다. 응답을 처리하는 중에 오류가 발생했습니다.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              문화재 도우미
            </h1>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 mb-20 sm:mb-24">
        {/* 시작 메시지 */}
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg sm:text-xl mb-2">안녕하세요!</p>
              <p className="text-sm sm:text-base">
                문화재에 대해 궁금한 점을 물어보세요.
              </p>
            </div>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p className="text-sm sm:text-base break-words">
                {message.content}
              </p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center justify-center min-w-[44px] sm:min-w-[50px]"
            >
              <IoSend className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
