import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSelector } from "react-redux";

const MyPage = () => {
  const navigate = useNavigate();
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  // 사용자 정보
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2024-12-02",
  };

  // 문화재 예시 데이터
  const culturalItems = [
    { id: 1, name: "경복궁", type: "문화재" },
    { id: 2, name: "창덕궁", type: "문화재" },
    { id: 3, name: "덕수궁", type: "문화재" },
    { id: 4, name: "창경궁", type: "문화재" },
    { id: 5, name: "종묘", type: "문화재" },
    { id: 6, name: "숭례문", type: "문화재" },
    { id: 7, name: "흥인지문", type: "문화재" },
  ];

  useEffect(() => {
    // localStorage에서 즐겨찾기한 행사 가져오기
    const savedFavorites = localStorage.getItem("selectedFestivals");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      // 행사 데이터 형식 맞추기
      const formattedFavorites = parsedFavorites.map((name, index) => ({
        id: `event-${index}`,
        name: name,
        type: "행사",
      }));
      setFavoriteEvents(formattedFavorites);
    }
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("로그아웃되었습니다.");
    navigate("/home");
  };

  // 슬라이드 스크롤 관련 ref와 함수들
  const culturalRef = useRef(null);
  const eventRef = useRef(null);

  const scroll = (ref, direction) => {
    const scrollAmount = 960;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderSection = (type, ref) => {
    const items = type === "문화재" ? culturalItems : favoriteEvents;
    const hasMoreThanFour = items.length > 4;

    return (
      <div className="relative flex-1 overflow-hidden">
        <h4 className="text-2xl font-medium mb-6">{type}</h4>
        <div className="relative mx-6">
          <div className="flex justify-center">
            <div ref={ref} className="flex overflow-x-hidden pb-4 w-[1100px]">
              <div className="flex gap-8">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      className="flex-none w-[300px] h-48 border-2 border-gray-200 rounded-xl flex flex-col justify-center items-center hover:border-blue-500 transition-colors duration-300"
                      key={item.id}
                    >
                      <div className="text-xl font-medium text-gray-700">
                        {item.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500">
                    {type === "행사"
                      ? "즐겨찾기한 행사가 없습니다."
                      : "문화재 정보가 없습니다."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {hasMoreThanFour && (
            <>
              <button
                onClick={() => scroll(ref, "left")}
                className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <IoChevronBack size={28} />
              </button>
              <button
                onClick={() => scroll(ref, "right")}
                className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <IoChevronForward size={28} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-h-[900px] p-12">
        <div className="w-full h-full grid grid-cols-6 gap-12">
          {/* 사용자 정보 섹션 */}
          <div className="col-span-1 bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-12">마이페이지</h2>
              <div className="space-y-8">
                <p className="text-lg">
                  <strong>이름:</strong> {user.name}
                </p>
                <p className="text-lg">
                  <strong>이메일:</strong> {user.email}
                </p>
                <p className="text-lg">
                  <strong>가입일:</strong> {user.joinDate}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-12 w-full bg-blue-800 text-white px-6 py-4 rounded-md text-lg hover:bg-blue-700 transition-colors duration-300"
            >
              로그아웃
            </button>
          </div>

          {/* 즐겨찾기 섹션 */}
          <div className="col-span-5 bg-white p-12 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-semibold mb-12">나의 즐겨찾기</h3>

              {/* 문화재 섹션 */}
              <div className="mb-16">
                {renderSection("문화재", culturalRef)}
              </div>

              {/* 행사 섹션 */}
              <div>{renderSection("행사", eventRef)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
