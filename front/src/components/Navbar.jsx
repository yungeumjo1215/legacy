import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import a1 from "../assets/a1.png"; // 로고 이미지

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "홈", path: "/", image: "/home-hero.jpg" },
    { name: "챗봇", path: "/chatbot", image: "/Chatbot-hero.jpg" },
    { name: "국가유산 위치 검색", path: "/search", image: "/Search-hero.jpg" },
    {
      name: "국가유산 행사일정",
      path: "/event_schedule",
      image: "/Event_schedule-hero.jpg",
    },
  ];

  // 네비게이션 클릭 핸들러
  const handleNavClick = (name) => {
    setActiveTab(name);
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  // 로그인/로그아웃 핸들러
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/"); // 로그아웃 후 홈으로 이동
    } else {
      setIsLoggedIn(true);
      navigate("/login"); // 로그인 페이지로 이동
    }
    setIsMobileMenuOpen(false);
  };

  // 현재 경로가 회원가입 페이지인지 확인
  const isSignUpPage = location.pathname === "/signup";

  return (
    <main>
      <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img src={a1} alt="Logo" className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">유산지기</span>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <div className="hidden md:flex flex-grow justify-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.name)}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === item.name
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-blue-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* 로그인/회원가입/마이페이지 */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/mypage"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLoginLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                  >
                    <LogInIcon className="h-4 w-4 mr-2" />
                    로그인
                  </button>
                  {/* 회원가입 버튼은 회원가입 페이지에서는 표시하지 않음 */}
                  {!isSignUpPage && (
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                    >
                      회원가입
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center md:hidden">
              <button
                className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.name)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center justify-around px-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/mypage"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-2" />
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLoginLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLoginLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                    >
                      로그인
                    </button>
                    {/* 모바일 메뉴에서도 회원가입 버튼 숨기기 */}
                    {!isSignUpPage && (
                      <Link
                        to="/signup"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                      >
                        회원가입
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </main>
  );
};

export default Navbar;
