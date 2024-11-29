import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 초기화
    setError("");

    // 필드 검증
    if (!email.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요."); // 필드 확인
      return;
    }

    if (!isValidEmail(email)) {
      setError("유효한 이메일 주소를 입력해주세요."); // 이메일 형식 검증
      return;
    }

    try {
      setLoading(true); // 요청 시작 시 로딩 활성화
      const response = await axios.post(
        "http://localhost:8000/account/create",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json", // 명시적으로 Content-Type 추가
          },
        }
      );
      console.log("Response received:", response.data);
      alert(response.data.message || "로그인 성공!"); // 성공 메시지
      setError(""); // 에러 초기화
      setEmail(""); // 필드 초기화
      setPassword(""); // 필드 초기화
    } catch (error) {
      console.error("Full Error Object:", error); // 전체 오류 객체 출력

      if (error.response) {
        // 서버가 응답했지만 상태 코드가 4xx/5xx인 경우
        console.error("Error Response Status:", error.response.status); // 상태 코드 출력
        console.error(
          "Error Response Data:",
          error.response.data || "No data returned"
        ); // 데이터 확인
        setError(error.response.data?.message || "문제가 발생했습니다.");
      } else if (error.request) {
        // 요청이 전송되었지만 서버로부터 응답이 없는 경우
        console.error("No Response:", error.request);
        setError("서버로부터 응답이 없습니다. 다시 시도해주세요.");
      } else {
        // 요청 설정 중 문제가 발생한 경우
        console.error("Error Setting Up Request:", error.message);
        setError("요청을 설정하는 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

        {/* 에러 메시지 출력 */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              아이디 (이메일)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일 입력"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호 입력"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} // 로딩 중 버튼 비활성화
            className={`w-full px-4 py-2 rounded-md text-white focus:outline-none ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "로그인 중..." : "로그인"}{" "}
            {/* 로딩 상태에 따른 텍스트 */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
