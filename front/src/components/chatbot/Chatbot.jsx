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

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/sample", {
        message: inputMessage,
      });

      const botMessage = {
        type: "bot",
        content: response.data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("챗봇 응답 오류:", error);

      const errorMessage = {
        type: "bot",
        content: "죄송합니다. 응답을 처리하는 중에 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 pt-16">
      {/* 메인 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* 시작 메시지 */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  안녕하세요! 문화재 도우미입니다
                </h2>
                <p className="text-gray-600">
                  문화재에 대해 궁금하신 점을 자유롭게 물어보세요
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h3 className="font-semibold mb-2">이런 것들을 물어보세요:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 경복궁의 역사가 궁금해요</li>
                  <li>• 불국사는 언제 지어졌나요?</li>
                  <li>• 석굴암의 특징을 알려주세요</li>
                </ul>
              </div>
            </div>
          )}

          {/* 메시지 목록 */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-md"
                  }`}
                >
                  <p className="text-sm md:text-base break-words">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {/* 로딩 표시 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              <span>전송</span>
              <IoSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
