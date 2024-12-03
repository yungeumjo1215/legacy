import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import FavoriteList from "./FavoriteList";

const MyPage = () => {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 사용자 정보 가져오기
  const user = {
    name: localStorage.getItem("userName") || "사용자",
    email: localStorage.getItem("userEmail") || "이메일 정보 없음",
    joinDate: localStorage.getItem("joinDate") || "가입일 정보 없음",
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("joinDate");
    alert("로그아웃되었습니다.");
    navigate("/home");
  };

  return (
    <div className="h-screen bg-gray-100 pt-16">
      <div className="h-[calc(100%-4rem)] p-8">
        <div className="h-full grid grid-cols-6 gap-8">
          {/* 사용자 정보 섹션 - 1200px 이하에서 숨김 */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg hidden xl:block">
            <div>
              <h2 className="text-2xl font-bold mb-8">마이페이지</h2>
              <div className="space-y-6">
                <p className="text-base">
                  <strong>이름:</strong> {user.name}
                </p>
                <p className="text-base">
                  <strong>이메일:</strong> {user.email}
                </p>
                <p className="text-base">
                  <strong>가입일:</strong> {user.joinDate}
                </p>
              </div>
            </div>
          </div>
          <div className="h-full p-8 bg-white rounded-lg shadow-lg w-full col-span-5">
            <FavoriteList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyPage;
