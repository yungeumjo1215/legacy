import React from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();

  // 예시: 사용자 정보 (실제 구현에서는 API 요청으로 가져와야 함)
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2023-11-27",
  };

  const handleLogout = () => {
    // 로그아웃 후 홈으로 이동
    alert("로그아웃되었습니다.");
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">마이페이지</h2>
        <div className="space-y-4">
          <p>
            <strong>이름:</strong> {user.name}
          </p>
          <p>
            <strong>이메일:</strong> {user.email}
          </p>
          <p>
            <strong>가입일:</strong> {user.joinDate}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full text-white px-4 py-2 rounded-md "
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
