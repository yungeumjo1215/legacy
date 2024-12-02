import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const MyPage = () => {
  const navigate = useNavigate();

  // 사용자 정보 예시 데이터
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2024-12-02",
  };

  // 즐겨찾기 항목 예시 데이터
  const items = [
    { id: 1, name: "경복궁", type: "문화재" },
    { id: 2, name: "창덕궁", type: "문화재" },
    { id: 3, name: "덕수궁", type: "문화재" },
    { id: 4, name: "창경궁", type: "문화재" },
    { id: 5, name: "종묘", type: "문화재" },
    { id: 6, name: "숭례문", type: "문화재" },
    { id: 7, name: "흥인지문", type: "문화재" },
    { id: 8, name: "서울등축제", type: "행사" },
    { id: 9, name: "롯데월드", type: "행사" },
    { id: 10, name: "남산타워", type: "행사" },
    { id: 11, name: "석촌호수", type: "행사" },
    { id: 12, name: "한강공원", type: "행사" },
    { id: 13, name: "청계천축제", type: "행사" },
    { id: 14, name: "서울마라톤", type: "행사" },
  ];

  // 슬라이드 스크롤 관련 ref와 함수들
  const culturalRef = useRef(null);
  const eventRef = useRef(null);

  const scroll = (ref, direction) => {
    const scrollAmount = 960; // 새로운 컨테이너 너비에 맞춰 수정
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // renderItems 함수 수정
  const renderSection = (type, ref) => {
    const filteredItems = items.filter((item) => item.type === type);
    const hasMoreThanFour = filteredItems.length > 4;

    return (
      <div className="relative flex-1 overflow-hidden">
        <h4 className="text-2xl font-medium mb-6">{type}</h4>
        <div className="relative mx-12">
          <div className="flex justify-center">
            <div ref={ref} className="flex overflow-x-hidden pb-4 w-[1330px]">
              <div className="flex gap-8">
                {filteredItems.map((item) => (
                  <div
                    className="flex-none w-[320px] h-48 border-2 border-gray-200 rounded-xl flex flex-col justify-center items-center hover:border-blue-500 transition-colors duration-300"
                    key={item.id}
                  >
                    <div className="text-xl font-medium text-gray-700">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {hasMoreThanFour && (
            <>
              <button
                onClick={() => scroll(ref, "left")}
                className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <IoChevronBack size={28} />
              </button>
              <button
                onClick={() => scroll(ref, "right")}
                className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
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
