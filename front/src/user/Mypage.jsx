import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const MyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { heritages, festivals } = useSelector((state) => state.favorites);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [alertMessage, setAlertMessage] = useState("");

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

  const favoriteEvents = festivals.map((festival) => ({
    id: festival.programName, // 프로그램 이름을 id로 사용
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
    const scrollAmount = 338 + 16; // 카드 너비 + gap
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
          ccbaKdcd: heritageData.ccbaKdcd || heritageData.id,
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

  // 즐겨찾기 상태 확인 함수
  const checkIsFavorite = (item, type) => {
    if (type === "문화재") {
      return heritages.some((heritage) => heritage.ccbaKdcd === item.ccbaKdcd);
    } else {
      return festivals.some(
        (festival) => festival.programName === item.programName
      );
    }
  };

  // 즐겨찾기 처리 함수
  const handleFavoriteClick = (item, type) => {
    if (!isLoggedIn) {
      setAlertMessage("로그인이 필요한 서비스입니다.");
      return;
    }

    const isFavorite = checkIsFavorite(item, type);

    if (type === "문화재") {
      if (isFavorite) {
        dispatch(
          removeFavorite({
            id: item.ccbaKdcd,
            type: "heritage",
          })
        );
        setAlertMessage("즐겨찾기가 해제되었습니다.");
      } else {
        dispatch(
          addFavorite({
            id: item.ccbaKdcd,
            type: "heritage",
            ccbaMnm1: item.ccbaMnm1,
            imageUrl: item.imageUrl,
            content: item.content,
            ccbaLcad: item.ccbaLcad,
            ccceName: item.ccceName,
          })
        );
        setAlertMessage("즐겨찾기에 추가되었습니다.");
      }
    } else {
      if (isFavorite) {
        dispatch(
          removeFavorite({
            programName: item.programName,
            type: "event",
          })
        );
        setAlertMessage("즐겨찾기가 해제되었습니다.");
      } else {
        dispatch(
          addFavorite({
            type: "event",
            programName: item.programName,
            programContent: item.programContent,
            location: item.location,
            startDate: item.startDate,
            endDate: item.endDate,
            targetAudience: item.targetAudience,
            contact: item.contact,
          })
        );
        setAlertMessage("즐겨찾기에 추가되었습니다.");
      }
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
  };

  const renderSection = (type, ref) => {
    const items = type === "문화재" ? culturalItems : favoriteEvents;

    return (
      <div className="relative flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-medium">{type}</h4>
        </div>
        <div className="relative mx-4">
          <div className="flex justify-center">
            <div
              ref={ref}
              className="flex overflow-x-auto gap-4 pb-4 relative w-full xl:w-[1400px] min-h-[280px]"
            >
              <div className="flex gap-4 w-full">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      className={`flex-none w-full sm:w-[calc(50%-8px)] xl:w-[338px] border-2 border-gray-200 rounded-xl 
                               flex flex-col justify-start items-center hover:border-blue-500 transition-colors 
                               duration-300 overflow-hidden cursor-pointer
                               ${
                                 type === "행사"
                                   ? "h-[220px] sm:h-[250px]"
                                   : "h-[270px] sm:h-[300px]"
                               }`}
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                    >
                      <div
                        className={`w-full overflow-hidden 
                        ${
                          type === "행사"
                            ? "h-[130px] sm:h-[150px]"
                            : "h-[180px] sm:h-[200px]"
                        }`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-image.jpg";
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
                          <div className="text-sm text-gray-600 line-clamp-2 break-all">
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
                  <div className="w-full h-[250px] flex items-center justify-center text-gray-500 text-lg">
                    {type === "행사"
                      ? "즐겨찾기한 행사가 없습니다."
                      : "즐겨찾기한 문화재가 없습니다."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <>
              <button
                onClick={() => scroll(ref, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 z-10 xl:flex hidden items-center justify-center "
              >
                <IoChevronBack size={24} />
              </button>
              <button
                onClick={() => scroll(ref, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 z-10 xl:flex hidden items-center justify-center"
              >
                <IoChevronForward size={24} />
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

          {/* 즐겨찾기 섹션 - 1200px 이하에서 전체 너비 사용 */}
          <div className="col-span-6 xl:col-span-5 bg-white p-8 rounded-lg shadow-lg flex flex-col">
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

      {/* 문화재 모달 */}
      {selectedHeritage && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center">
          <div
            className="relative bg-white text-black p-8 rounded-lg z-[10000] w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[28px] m-0 MainFont break-words flex-1 pr-5">
                {selectedHeritage.ccbaMnm1}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    handleFavoriteClick(selectedHeritage, "문화재")
                  }
                  className="text-2xl text-yellow-500 hover:text-yellow-600"
                >
                  {checkIsFavorite(selectedHeritage, "문화재") ? (
                    <AiFillStar />
                  ) : (
                    <AiOutlineStar />
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-[#121a35] text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
                >
                  X
                </button>
              </div>
            </div>

            {selectedHeritage.imageUrl && (
              <img
                src={selectedHeritage.imageUrl}
                alt={selectedHeritage.ccbaMnm1}
                className="w-full rounded-lg mb-5 max-h-[350px] object-cover"
              />
            )}

            <p className="SubFont text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed">
              {selectedHeritage.content}
            </p>

            <div className="SubFont text-base mb-2.5 flex flex-col gap-2.5">
              <p>
                <strong className="MainFont">위치:</strong>{" "}
                {selectedHeritage.ccbaLcad}
              </p>
              <p>
                <strong className="MainFont">시대:</strong>{" "}
                {selectedHeritage.ccceName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 행사 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center">
          <div
            className="relative bg-white text-black p-8 rounded-lg z-[10000] w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[28px] m-0 MainFont break-words flex-1 pr-5">
                {selectedEvent.programName}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleFavoriteClick(selectedEvent, "행사")}
                  className="text-2xl text-yellow-500 hover:text-yellow-600"
                >
                  {checkIsFavorite(selectedEvent, "행사") ? (
                    <AiFillStar />
                  ) : (
                    <AiOutlineStar />
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-[#121a35] text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
                >
                  X
                </button>
              </div>
            </div>

            <div className="SubFont text-2xl space-y-3">
              <div className="border border-gray-700 w-full p-4 rounded-md text-gray-950 whitespace-pre-line overflow-hidden text-[20px]">
                <p>{selectedEvent.programContent}</p>
              </div>

              <div className="SubFont grid grid-cols-2 gap-4 text-lg">
                <div>
                  <p>기간</p>
                  <p>
                    {selectedEvent.startDate} ~ {selectedEvent.endDate}
                  </p>
                </div>
                <div>
                  <p>장소</p>
                  <p>{selectedEvent.location}</p>
                </div>
                <div>
                  <p>대상</p>
                  <p>{selectedEvent.targetAudience}</p>
                </div>
                <div>
                  <p>문의</p>
                  <p>{selectedEvent.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 알림 모달 */}
      {alertMessage && (
        <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <p className="text-center text-lg mb-4">{alertMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={closeAlert}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
