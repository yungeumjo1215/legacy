import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TiStarFullOutline } from "react-icons/ti";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import EventModal from "./EventModal";
import "../components/EventSchedule.css";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";
import default_Img from "../assets/festival.png";
import { IoIosArrowUp } from "react-icons/io";

const REGIONS = [
  { id: "all", name: "전체", sido: null },
  { id: "seoul", name: "서울", sido: "서울특별시" },
  { id: "incheon", name: "인천", sido: "인천광역시" },
  { id: "busan", name: "부산", sido: "부산광역시" },
  { id: "ulsan", name: "울산", sido: "울산광역시" },
  { id: "gyeonggi", name: "경기도", sido: "경기도" },
  { id: "gangwon", name: "강원도", sido: "강원도" },
  { id: "chungcheong", name: "충청도", sido: ["충청북도", "충청남도"] },
  { id: "gyeongsang", name: "경상도", sido: ["경상북도", "경상남도"] },
  { id: "jeolla", name: "전라도", sido: ["전라북도", "전라남도"] },
  { id: "jeju", name: "제주도", sido: "제주특별자치도" },
];
const formatValue = (value) => {
  if (value === "N/A") return "모두";
  if (typeof value === "string" && value.length > 20) {
    return value.substring(0, 20) + "...";
  }
  return value;
};

const formatDateString = (dateArr) => {
  if (!dateArr || !dateArr[0]) return null;

  const dateStr = dateArr[0];
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  try {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateStr;
  }
};

const onErrorImg = (e) => {
  e.target.src = default_Img;
};

const parseYYYYMMDD = (dateArr) => {
  if (!dateArr || !dateArr[0] || dateArr[0].length !== 8) return null;

  try {
    const dateStr = dateArr[0];
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    return null;
  }
};

const SearchBar = memo(({ value, onChange }) => (
  <div className="flex justify-center w-full">
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full sm:w-auto md:w-[400px]"
    >
      <input
        type="text"
        placeholder="행사명을 입력해주세요"
        value={value}
        onChange={onChange}
        className="Event-sc rounded-s-[5px] flex-1 p-2"
      />
      <button
        type="submit"
        className="border bg-blue-800 text-white rounded-e-[5px] px-4 whitespace-nowrap"
      >
        검색
      </button>
    </form>
  </div>
));

const EventItem = memo(
  ({ event, isStarred, handleStarClick, onEventClick }) => (
    <li className="pb-2">
      <div className="border p-4 rounded-lg  transition-colors">
        <div className="flex items-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStarClick(event);
            }}
            className={`star-button mr-2 sm:mr-3 ${
              isStarred ? "text-yellow-400" : "text-gray-300"
            }`}
            tabIndex={0}
            aria-label={`${event.programName} 즐겨찾기 ${
              isStarred ? "제거" : "추가"
            }`}
          >
            <TiStarFullOutline className="text-2xl sm:text-3xl" />
          </button>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="MainFont text-xl sm:text-2xl ml-[225px]">
                {event.programName}
              </h3>
              <button
                className="border-2 border-blue-800 rounded-md
                           hover:bg-blue-800 hover:text-white
                          text-sm sm:text-base lg:text-lg
                          px-2 sm:px-3 lg:px-4
                          py-1 sm:py-1.5 lg:py-2
                          transition-all duration-300 ease-in-out
                          shadow-sm hover:shadow-md
                          text-center text-nowrap
                          font-bold"
                onClick={() => onEventClick(event)}
              >
                더보기
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="lg:max-w-56 w-full">
                <img
                  src={
                    event.image && event.image !== "N/A"
                      ? event.image
                      : default_Img
                  }
                  alt={event.programName}
                  className="w-full h-auto object-cover border rounded-lg"
                  loading="lazy"
                  onError={onErrorImg}
                />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                  <div className=" p-2 sm:p-3 rounded-lg">
                    <p className="SubFont text-base sm:text-lg">
                      <span className="font-medium mr-2">행사 내용:</span>
                      {formatValue(event.programContent)}
                    </p>
                  </div>
                  <div className=" p-2 sm:p-3 rounded-lg">
                    <p className="SubFont text-base sm:text-lg">
                      <span className="font-medium mr-2">기간:</span>
                      {event.startDate} ~ {formatValue(event.endDate)}
                    </p>
                  </div>
                  <div className=" p-2 sm:p-3 rounded-lg">
                    <p className="SubFont text-base sm:text-lg">
                      <span className="font-medium mr-2">장소:</span>
                      {formatValue(event.location)}
                    </p>
                  </div>
                  <div className=" p-2 sm:p-3 rounded-lg">
                    <p className="SubFont text-base sm:text-lg">
                      <span className="font-medium mr-2">대상:</span>
                      {formatValue(event.targetAudience)}
                    </p>
                  </div>
                  <div className=" p-2 sm:p-3 rounded-lg lg:col-span-2">
                    <p className="SubFont text-base sm:text-lg">
                      <span className="font-medium mr-2">문의:</span>
                      {formatValue(event.contact)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
);

const EventSchedule = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    festivalList,
    loading,
    error: fetchError,
  } = useSelector((state) => state.festival);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { festivals } = useSelector((state) => state.favorites);
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); //300px 이상 스크롤 시 맨 위로 가기 버튼 표시
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isEventStarred = useCallback(
    (programName) => {
      return festivals.some((festival) => festival.programName === programName);
    },
    [festivals]
  );

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    dispatch(fetchFestivalData({ year, month }));
  }, [date, dispatch]);

  const filteredFestivals = useMemo(() => {
    if (!Array.isArray(festivalList)) return [];

    return festivalList.filter((festival) => {
      try {
        const startDate = parseYYYYMMDD(festival.startDate);
        const endDate = parseYYYYMMDD(festival.endDate);
        if (!startDate || !endDate) return false;

        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);

        const matchesDate = currentDate >= startDate && currentDate <= endDate;
        const matchesSearch = festival.programName?.[0]
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());

        let matchesRegion = selectedRegion === "all";

        if (!matchesRegion && festival.sido) {
          let regionSido;
          if (Array.isArray(festival.sido)) {
            regionSido = festival.sido[0]?.toLowerCase() || "";
          } else if (typeof festival.sido === "string") {
            regionSido = festival.sido.toLowerCase();
          } else {
            regionSido = "";
          }

          switch (selectedRegion) {
            case "seoul":
              matchesRegion = /서울|seoul/i.test(regionSido);
              break;
            case "incheon":
              matchesRegion = /인천|incheon/i.test(regionSido);
              break;
            case "gyeonggi":
              matchesRegion = /경기|gyeonggi/i.test(regionSido);
              break;
            case "gangwon":
              matchesRegion = /강원|gangwon/i.test(regionSido);
              break;
            case "jeolla":
              matchesRegion = /전라|전북|전남|광주|jeolla|gwangju/i.test(
                regionSido
              );
              break;
            case "chungcheong":
              matchesRegion = /충청|충북|충남|대전|chungcheong|daejeon/i.test(
                regionSido
              );
              break;
            case "gyeongsang":
              matchesRegion = /경상|경북|경남|대구|gyeongsang|daegu/i.test(
                regionSido
              );
              break;
            case "busan":
              matchesRegion = /부산|busan/i.test(regionSido);
              break;
            case "ulsan":
              matchesRegion = /울산|ulsan/i.test(regionSido);
              break;
            case "jeju":
              matchesRegion = /제주|jeju/i.test(regionSido);
              break;
            default:
              matchesRegion = false;
          }
        }

        return matchesDate && matchesSearch && matchesRegion;
      } catch (error) {
        console.error("Festival filtering error:", error, festival);
        return false;
      }
    });
  }, [festivalList, date, search, selectedRegion]);

  const formattedFestivals = useMemo(() => {
    return filteredFestivals.map((festival) => ({
      programName: Array.isArray(festival.programName)
        ? festival.programName[0]
        : festival.programName,
      programContent: Array.isArray(festival.programContent)
        ? festival.programContent[0]
        : festival.programContent,
      startDate: formatDateString(festival.startDate),
      endDate: formatDateString(festival.endDate),
      location: Array.isArray(festival.location)
        ? festival.location[0]
        : festival.location,
      contact: Array.isArray(festival.contact)
        ? festival.contact[0]
        : festival.contact,
      image: Array.isArray(festival.image) ? festival.image[0] : festival.image,
      targetAudience: Array.isArray(festival.targetAudience)
        ? festival.targetAudience[0]
        : festival.targetAudience,
    }));
  }, [filteredFestivals]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleRegionSelect = useCallback((region) => {
    setSelectedRegion(region);
  }, []);

  const handleStarClick = useCallback(
    (festival) => {
      console.log("Adding festival with image:", festival.image);

      if (!isLoggedIn) {
        setError(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
        );
        return;
      }

      try {
        const isAlreadySelected = isEventStarred(festival.programName);

        if (!isAlreadySelected) {
          dispatch(
            addFavorite({
              type: "event",
              id: festival.programName,
              programName: festival.programName,
              programContent: festival.programContent,
              location: festival.location,
              startDate: festival.startDate,
              endDate: festival.endDate,
              targetAudience: festival.targetAudience,
              contact: festival.contact,
              imageUrl: festival.image,
            })
          );
          setSuccessMessage("즐겨찾기에 추가되었습니다.");
        } else {
          dispatch(
            removeFavorite({
              type: "event",
              id: festival.programName,
            })
          );
          setSuccessMessage("즐겨찾기가 해제되었습니다.");
        }

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("즐겨찾기 처리 중 오류 발생:", error);
        setError("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    },
    [isLoggedIn, dispatch, isEventStarred]
  );

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);

    // 최근 본 목록에 추가
    const recentItems = JSON.parse(localStorage.getItem("recentItems")) || [];
    const newItem = {
      id: event.id || `event-${event.programName}`,
      type: "event",
      title: event.programName,
      imageUrl: event.image,
      begin_de: event.startDate,
      location: event.location,
      content: event.programContent,
    };

    const filtered = recentItems.filter((recent) => recent.id !== newItem.id);
    const updated = [newItem, ...filtered].slice(0, 5);
    localStorage.setItem("recentItems", JSON.stringify(updated));
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const closeError = () => {
    setError("");
  };

  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleLoginClick = () => {
    navigate("/login");
    closeError();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = formattedFestivals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(formattedFestivals.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const Pagination = () => {
    return (
      <div className="flex justify-center items-center mt-6 gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            이전
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-800 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            다음
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRegion]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="MainFont md:text-5xl text-center sm:text-left text-4xl text-gray-900 mb-8">
          문화재 행사 정보
        </h1>

        <div className="bg-white min-h-[410px] rounded-lg shadow-md p-6 mb-8">
          <div className="xl:flex xl:flex-row flex-col justify-between items-start gap-6">
            <div
              className="xl:w-1/2 w-full flex flex-wrap justify-center sm:justify-start items-center 
                          sm:ml-4 gap-2 sm:gap-4 xl:mt-[6.25rem] mt-4"
            >
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 ">
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionSelect(region.id)}
                    className={`SubFont px-2 sm:px-4 py-1 sm:py-2 rounded-md text-base sm:text-lg transition-colors
                      ${
                        selectedRegion === region.id
                          ? "bg-blue-800 text-white"
                          : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="xl:w-3/5 w-full sm:flex flex justify-center mt-6 xl:mt-0">
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full rounded-lg shadow-sm calendar-custom"
                locale="ko-KR"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="w-full sm:w-1/2 mb-4 flex justify-start">
            <p className="SubFont text-2xl">
              Total: {formattedFestivals.length}건
            </p>
          </div>
          <div className="w-full sm:w-1/3 mb-4 sm:ml-auto">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="MainFont md:text-3xl text-2xl mb-6">
            {date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            행사 목록
          </h2>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            </div>
          )}

          {fetchError && (
            <div className="text-red-600 text-center py-8">
              <p>{fetchError}</p>
            </div>
          )}

          {error && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-[9999]"
                onClick={closeError}
              />
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           bg-[#e2e2e2] text-black p-4 md:p-5 rounded-lg z-[10000] 
                           w-[90%] md:w-[400px] max-w-[400px]
                           h-[180px] md:h-[200px] 
                           flex flex-col justify-center items-center text-center"
                role="alert"
              >
                <p className="font-bold text-base md:text-lg whitespace-pre-wrap mt-4 md:mt-5">
                  {error}
                </p>
                <div className="mt-4 md:mt-6 flex gap-2 md:gap-2.5">
                  <button
                    onClick={handleLoginClick}
                    className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                             cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={closeError}
                    className="bg-gray-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                             cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </>
          )}

          {successMessage && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-[9999]"
                onClick={closeSuccessMessage}
              />
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           bg-[#e2e2e2] text-black p-4 md:p-5 rounded-lg z-[10000] 
                           w-[90%] md:w-[400px] max-w-[400px]
                           h-[150px] md:h-[170px] 
                           flex flex-col justify-center items-center text-center"
                role="alert"
              >
                <p className="font-bold text-base md:text-lg whitespace-pre-wrap mt-4 md:mt-5">
                  {successMessage}
                </p>
                <button
                  onClick={closeSuccessMessage}
                  className="mt-4 md:mt-6 bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                           cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  확인
                </button>
              </div>
            </>
          )}

          {!loading && !fetchError && !error && (
            <>
              <ul className="SubFont text-3xl space-y-4 overflow-hidden">
                {currentItems.length > 0 ? (
                  currentItems.map((festival, index) => (
                    <EventItem
                      key={`${festival.programName}-${index}`}
                      event={festival}
                      isStarred={isEventStarred(festival.programName)}
                      handleStarClick={handleStarClick}
                      onEventClick={handleEventClick}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    해당 날짜에 예정된 행사가 없습니다.
                  </p>
                )}
              </ul>
              {formattedFestivals.length > itemsPerPage && <Pagination />}
            </>
          )}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 ease-in-out"
              aria-label="맨 위로 가기"
            >
              <IoIosArrowUp size={24} />
            </button>
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default memo(EventSchedule);
