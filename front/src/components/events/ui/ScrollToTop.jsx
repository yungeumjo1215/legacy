import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

// 스크롤 상단 이동 버튼 컴포넌트
// - 스크롤 위치에 따른 버튼 표시/숨김
// - 클릭 시 페이지 최상단으로 스크롤
const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 ease-in-out"
      aria-label="맨 위로 가기"
    >
      <IoIosArrowUp size={24} />
    </button>
  );
};

export default ScrollToTop;
