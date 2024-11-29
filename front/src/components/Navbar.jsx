import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import logo_w from "../assets/logo_w.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 네비게이션 항목 정의
  const navigationItems = [
    { name: "홈", path: "/" },
    { name: "챗봇", path: "/chatbot" },
    { name: "국가유산 위치 검색", path: "/search" },
    { name: "국가유산 행사일정", path: "/event_schedule" },
  ];

  // 로그인/로그아웃 처리
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  // 현재 페이지 확인
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";

  // 인증 관련 버튼 렌더링
  const renderAuthButtons = (isMobile = false) => {
    if (isLoggedIn) {
      return (
        <>
          <Link
            to="/mypage"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
          >
            {!isMobile && <UserCircleIcon className="h-4 w-4 mr-2" />}
            마이페이지
          </Link>
          <button
            onClick={handleLoginLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
          >
            {!isMobile && <LogOutIcon className="h-4 w-4 mr-2" />}
            로그아웃
          </button>
        </>
      );
    }

    if (isLoginPage) {
      return (
        <Link
          to="/signup"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
        >
          회원가입
        </Link>
      );
    }

    if (isSignUpPage) {
      return (
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
        >
          <LogInIcon className="h-4 w-4 mr-2" />
          로그인
        </button>
      );
    }

    return (
      <>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
        >
          {!isMobile && <LogInIcon className="h-4 w-4 mr-2" />}
          로그인
        </button>
        <Link
          to="/signup"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
        >
          회원가입
        </Link>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo_w} alt="Logo" className="h-20 w-20 mr-1" />
              <span className="text-3xl font-bold">유산지기</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex flex-grow justify-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-blue-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 데스크톱 인증 버튼 */}
          <div className="hidden md:flex items-center space-x-4">
            {renderAuthButtons()}
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center justify-around px-4">
              {renderAuthButtons(true)}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
