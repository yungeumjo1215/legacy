import React, { useState } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import {
  SearchIcon,
  BellIcon,
  MessageCircleIcon,
  UserCircleIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon, // 햄버거 아이콘 추가
  XIcon, // 닫기 아이콘 추가
} from "lucide-react";
import a1 from "../assets/a1.png"; // 로고 이미지

const Navbar = () => {
  // State management
  const [activeTab, setActiveTab] = useState("Home");
  const [currentImage, setCurrentImage] = useState("/home-hero.jpg");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태 관리
  const location = useLocation();
  const currentPath = location.pathname.slice(1) || "home";

  // Navigation data
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

  // Click handler for nav links
  const handleNavClick = (name, image) => {
    setActiveTab(name);
    setCurrentImage(image);
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  // Handle login/logout state
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  return (
    <main>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Nav Links */}
            <div className="flex items-center">
              {/* Logo and Text */}
              <Link to="/home" className="flex-shrink-0 flex items-center">
                <img
                  src={a1} // Logo image path
                  alt="Logo"
                  className="h-8 w-8 mr-2" // Adjust the size and margin of the logo
                />
                <span className="text-2xl font-bold">유산지기</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.name, item.image)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium cursor-pointer
                    ${
                      activeTab === item.name
                        ? "border-white text-white"
                        : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                to="/search"
                className="p-2 rounded-full text-gray-300 hover:text-white"
              >
                <SearchIcon className="h-5 w-5" />
              </Link>
              <button className="p-2 rounded-full text-gray-300 hover:text-white">
                <BellIcon className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white">
                <MessageCircleIcon className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white">
                <UserCircleIcon className="h-5 w-5" />
              </button>

              {isLoggedIn ? (
                <Link
                  to="/"
                  onClick={handleLoginLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  로그아웃
                </Link>
              ) : (
                <div className="flex space-x-2">
                  {/* 로그인 버튼 */}
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                    onClick={handleLoginLogout}
                  >
                    <LogInIcon className="h-4 w-4 mr-2" />
                    로그인
                  </Link>

                  {/* 회원가입 버튼 */}
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.name, item.image)}
                  className={`block px-3 py-2 rounded-md text-base font-medium
                    ${
                      activeTab === item.name
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:text-white hover:bg-blue-700"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center justify-around px-4">
                <button className="p-2 rounded-full text-gray-300 hover:text-white">
                  <SearchIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full text-gray-300 hover:text-white">
                  <BellIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full text-gray-300 hover:text-white">
                  <MessageCircleIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full text-gray-300 hover:text-white">
                  <UserCircleIcon className="h-5 w-5" />
                </button>

                {isLoggedIn ? (
                  <Link
                    to="/"
                    onClick={handleLoginLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    로그아웃
                  </Link>
                ) : (
                  <div className="flex space-x-2">
                    {/* 로그인 버튼 */}
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                      onClick={handleLoginLogout}
                    >
                      <LogInIcon className="h-4 w-4 mr-2" />
                      로그인
                    </Link>

                    {/* 회원가입 버튼 */}
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-2" />
                      회원가입
                    </Link>
                  </div>
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
