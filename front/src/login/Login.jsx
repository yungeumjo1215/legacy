import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태 관리

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // 로그인 유효성 검사 (예시: username과 password가 빈 값일 때 에러 메시지 표시)
    if (!username || !password) {
      setError("사용자명과 비밀번호를 입력해주세요.");
      return;
    }

    // 여기서 로그인 API를 호출하거나, 로컬에서 인증을 처리할 수 있습니다.
    // 예시: 사용자명과 비밀번호가 "test"일 경우 로그인 성공
    if (username === "test" && password === "test") {
      // 로그인 성공 후, 원하는 페이지로 이동 (예: 홈 페이지로)
      navigate("/home");
    } else {
      setError("잘못된 사용자명 또는 비밀번호입니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              사용자명
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="사용자명"
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호"
              required
            />
          </div>

          {/* 오류 메시지 표시 */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
