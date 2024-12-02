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

    return (
      <div className="relative flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-medium">{type}</h4>
        </div>
        <div className="relative mx-4">
          <div className="flex justify-center">
            <div
              ref={ref}
              className="flex overflow-hidden pb-4 w-[1400px] min-h-[320px]"
            >
              <div className="flex gap-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      className="flex-none w-[338px] h-[300px] border-2 border-gray-200 rounded-xl flex flex-col justify-start items-center border-gray-300 hover:border-blue-500 transition-colors duration-300 overflow-hidden"
                      key={item.id}
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
                      <div className="p-3 w-full flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-700 mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex-1 min-h-0">
                          <div className="inline-block text-sm font-medium text-gray-600">
                            설명:{" "}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-3 break-all">
                            {item.content}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1 truncate">
                            <span className="font-medium">위치:</span>{" "}
                            {item.location}
                          </p>
                          {item.type === "행사" && item.date && (
                            <p className="text-xs text-gray-600 truncate">
                              <span className="font-medium">기간:</span>{" "}
                              {item.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-[1200px] h-[300px] flex items-center justify-center text-gray-500 text-lg">
                    {type === "행사"
                      ? "즐겨찾기한 행사가 없습니다."
                      : "즐겨찾기한 문화재가 없습니다."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 좌우 이동 버튼 */}
          {items.length > 4 && (
            <>
              <button
                onClick={() => scroll(ref, "left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <IoChevronBack size={28} />
              </button>
              <button
                onClick={() => scroll(ref, "right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
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
    <div className="h-screen bg-gray-100 pt-16">
      <div className="h-[calc(100%-4rem)] p-8">
        <div className="h-full grid grid-cols-6 gap-8">
          {/* 사용자 정보 섹션 */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
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

          {/* 즐겨찾기 섹션 */}
          <div className="col-span-5 bg-white p-8 rounded-lg shadow-lg flex flex-col">
            <div>
              <h3 className="text-3xl font-semibold mb-8">나의 즐겨찾기</h3>
              {/* 문화재 섹션 */}
              <div className="mb-6">{renderSection("문화재", culturalRef)}</div>
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
