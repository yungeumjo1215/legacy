import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  UserCircleIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import logo_w from "../assets/logo_w.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store에서 로그인 상태 가져오기
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const modalRef = useRef(null);
  const handleCloseModal = (e) => {
    if (
      isMobileMenuOpen &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setIsMobileMenuOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, [isMobileMenuOpen]);

  const handleMenuButtonClick = (e) => {
    e.stopPropagation(); // 이벤트 전파 중단
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // location이 변경될 때마다 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
      dispatch(logout());
      localStorage.removeItem("token");
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
            className="relative z-10 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden transition-all duration-500
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
              after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
              hover:before:w-full hover:after:w-full"
          >
            {!isMobile && <UserCircleIcon className="h-4 w-4 mr-2" />}
            마이페이지
          </Link>
          <button
            onClick={handleLoginLogout}
            className="relative z-10 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden transition-all duration-500
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
              after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
              hover:before:w-full hover:after:w-full"
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
          className={`relative z-10 px-2 lg:px-3 md:px-4 py-1 md:py-2 lg:py-2 rounded-md text-sm lg:text-base md:text-base font-medium transition-all duration-500 overflow-hidden text-white inline-flex items-center
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
            after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
            hover:before:w-full hover:after:w-full`}
        >
          회원가입
        </Link>
      );
    }

    if (isSignUpPage) {
      return (
        <button
          onClick={() => navigate("/login")}
          className={`relative z-10 px-2 lg:px-3 md:px-4 py-1 md:py-2 lg:py-2 rounded-md text-sm lg:text-base md:text-base font-medium transition-all duration-500 overflow-hidden text-white inline-flex items-center
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
            after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
            hover:before:w-full hover:after:w-full`}
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
          className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-500 overflow-hidden text-white inline-flex items-center
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
            after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
            hover:before:w-full hover:after:w-full`}
        >
          {!isMobile && <LogInIcon className="h-4 w-4 mr-2" />}
          로그인
        </button>
        <Link
          to="/signup"
          className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-500 overflow-hidden text-white inline-flex items-center
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
            after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
            hover:before:w-full hover:after:w-full`}
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
          {/* 로고*/}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logo_w}
                alt="Logo"
                className="h-16 w-16 md:h-20 md:w-20 mr-1"
              />
              <span className=" text-2xl md:text-3xl font-bold hidden lg:block">
                유산지기
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex lg:flex-grow justify-center items-center space-x-2 lg:space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative z-10 px-2 lg:px-3 md:px-4 py-1 md:py-2 lg:py-2 rounded-md text-sm lg:text-base md:text-base font-medium transition-all duration-500 overflow-hidden
                  ${
                    location.pathname === item.path
                      ? "text-white before:!w-full after:!w-full before:!duration-0 after:!duration-0"
                      : "text-white"
                  }
                  before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:-z-10 before:transition-all before:duration-[180ms] before:ease-in-out
                  after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white after:-z-10 after:transition-all after:duration-[180ms] after:ease-in-out after:delay-[180ms]
                  hover:before:w-full hover:after:w-full`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 데스크톱 인증 버튼 */}
          <div className="hidden lg:flex items-center space-x-2">
            {renderAuthButtons()}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center lg:hidden">
            <button
              className="p-2 rounded-md text-white focus:outline-none"
              onClick={handleMenuButtonClick} // onClick 핸들러 변경
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
        <div className="lg:hidden bg-blue-900" ref={modalRef}>
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
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
