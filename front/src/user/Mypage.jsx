import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";
import EventModal from "../components/EventModal";

const MyPage = () => {
  const navigate = useNavigate();
  const { heritages, festivals } = useSelector((state) => state.favorites);

  // 모달 상태 추가
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 사용자 정보 가져오기
  const user = {
    name: localStorage.getItem("userName") || "사용자",
    email: localStorage.getItem("userEmail") || "이메일 정보 없음",
    joinDate: localStorage.getItem("joinDate") || "가입일 정보 없음",
  };

  // 문화재와 행사 데이터 포맷팅
  const culturalItems = heritages.map((heritage) => ({
    id: heritage.id || heritage.ccbaKdcd,
    name: heritage.ccbaMnm1,
    type: "문화재",
    image: heritage.imageUrl || heritage.ccbaAsno,
    location: heritage.ccbaLcad || "위치 정보 없음",
    content: heritage.content || heritage.ccbaCtcdNm || "설명 정보 없음",
  }));

  const favoriteEvents = festivals.map((festival, index) => ({
    id: `event-${index}`,
    name: festival.programName,
    type: "행사",
    image: festival.image || null,
    location: festival.location || "위치 정보 없음",
    date: `${festival.startDate || ""} ~ ${festival.endDate || ""}`,
    content: festival.programContent || "설명 정보 없음",
  }));

  // 상태 복원
  useEffect(() => {
    const savedHeritage = localStorage.getItem("selectedHeritage");
    const savedEvent = localStorage.getItem("selectedEvent");

    if (savedHeritage) {
      setSelectedHeritage(JSON.parse(savedHeritage));
    }
    if (savedEvent) {
      setSelectedEvent(JSON.parse(savedEvent));
    }
  }, []);

  // 상태 저장
  useEffect(() => {
    if (selectedHeritage) {
      localStorage.setItem(
        "selectedHeritage",
        JSON.stringify(selectedHeritage)
      );
    } else {
      localStorage.removeItem("selectedHeritage");
    }

    if (selectedEvent) {
      localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
    } else {
      localStorage.removeItem("selectedEvent");
    }
  }, [selectedHeritage, selectedEvent]);

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

  // 클릭 핸들러 수정
  const handleItemClick = (item) => {
    if (item.type === "문화재") {
      const heritageData = heritages.find(
        (heritage) => heritage.ccbaKdcd === item.id || heritage.id === item.id
      );

      if (heritageData) {
        setSelectedHeritage({
          ccbaMnm1: heritageData.ccbaMnm1,
          imageUrl: heritageData.imageUrl,
          content: heritageData.content || heritageData.ccbaCtcdNm,
          ccbaLcad: heritageData.ccbaLcad,
          ccceName: heritageData.ccceName,
        });
      }
    } else {
      const festivalData = festivals.find(
        (festival) => festival.programName === item.name
      );

      if (festivalData) {
        setSelectedEvent({
          programName: festivalData.programName,
          programContent: festivalData.programContent,
          location: festivalData.location,
          startDate: festivalData.startDate,
          endDate: festivalData.endDate,
          targetAudience: festivalData.targetAudience || "전체",
          contact: festivalData.contact || "문의 정보 없음",
        });
      }
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedHeritage(null);
    setSelectedEvent(null);
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
                      className="flex-none w-[300px] h-[400px] border-2 border-gray-200 rounded-xl flex flex-col justify-start items-center hover:border-blue-500 transition-colors duration-300 overflow-hidden cursor-pointer"
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="w-full h-[200px] overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-image.jpg"; // 기본 이미지 경로 설정
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">이미지 없음</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 w-full flex-1 flex flex-col">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
                          <span className="font-medium">설명:</span>{" "}
                          {item.content}
                        </p>
                        <div className="mt-auto">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">위치:</span>{" "}
                            {item.location}
                          </p>
                          {item.type === "행사" && item.date && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">기간:</span>{" "}
                              {item.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500">
                    {type === "행사"
                      ? "즐겨찾기한 행사가 없습니다."
                      : "즐겨찾기한 문화재가 없습니다."}
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

      {/* 모달 컴포넌트 추가 */}
      {selectedHeritage && (
        <Modal item={selectedHeritage} onClose={handleCloseModal} />
      )}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MyPage;
