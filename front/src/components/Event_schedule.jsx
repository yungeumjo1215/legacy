import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TiStarFullOutline } from "react-icons/ti";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import EventModal from "./EventModal";

const REGIONS = [
  { id: "all", name: "전체" },
  { id: "seoul", name: "서울" },
  { id: "incheon", name: "인천" },
  { id: "gyeonggi", name: "경기도" },
  { id: "gangwon", name: "강원도" },
  { id: "jeolla", name: "전라도" },
  { id: "chungcheong", name: "충청도" },
  { id: "gyeongsang", name: "경상도" },
  { id: "busan", name: "부산" },
  { id: "jeju", name: "제주도" },
];

const formatValue = (value) => {
  return value === "N/A" ? "모두" : value;
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
  <form
    onSubmit={(e) => e.preventDefault()}
    className="sm:flex-none md:flex-center flex justify-center sm:m-5 md:m-0 w-full max-w-full"
  >
    <input
      type="text"
      placeholder="행사명을 입력해주세요"
      value={value}
      onChange={onChange}
      className="Event-sc rounded-s-[5px] flex-1 min-w-0 w-full md:max-w-[20rem]"
    />
    <button
      type="submit"
      className="border bg-blue-800 text-white rounded-e-[5px] px-4 whitespace-nowrap"
    >
      검색
    </button>
  </form>
));

const EventItem = memo(
  ({ event, isStarred, handleStarClick, onEventClick }) => (
    <li className="pb-2">
      <div
        className="border p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => onEventClick(event)}
      >
        <div className="flex items-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStarClick(event.programName);
            }}
            className={`star-button mr-3 ${
              isStarred ? "text-yellow-400" : "text-gray-300"
            }`}
            tabIndex={0}
            aria-label={`${event.programName} 즐겨찾기 ${
              isStarred ? "제거" : "추가"
            }`}
          >
            <TiStarFullOutline className="text-3xl" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-2xl mb-2">
              {formatValue(event.programName)}
            </h3>
            <p className="SubFont text-lg mb-2">
              {formatValue(event.programContent)}
            </p>
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-4 text-lg">
              <div>
                <p>
                  <span className="font-medium">기간:</span>{" "}
                  {formatValue(event.startDate)} ~ {formatValue(event.endDate)}
                </p>
                <p>
                  <span className="font-medium">장소:</span>{" "}
                  {formatValue(event.location)}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">대상:</span>{" "}
                  {formatValue(event.targetAudience)}
                </p>
                <p>
                  <span className="font-medium">문의:</span>{" "}
                  {formatValue(event.contact)}
                </p>
              </div>
            </div>
            {event.image && event.image !== "N/A" && (
              <img
                src={event.image}
                alt={event.programName}
                className="mt-3 rounded-md w-full max-w-md h-auto"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </li>
  )
);

const EventSchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    festivalList,
    loading,
    error: fetchError,
  } = useSelector((state) => state.festival);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        if (!matchesRegion && festival.location?.[0]) {
          const location = festival.location[0].toLowerCase();
          switch (selectedRegion) {
            case "seoul":
              matchesRegion = /서울|seoul/i.test(location);
              break;
            case "incheon":
              matchesRegion = /인천|incheon/i.test(location);
              break;
            case "gyeonggi":
              matchesRegion = /경기|gyeonggi/i.test(location);
              break;
            case "gangwon":
              matchesRegion = /강원|gangwon/i.test(location);
              break;
            case "jeolla":
              matchesRegion = /전라|전북|전남|광주|jeolla|gwangju/i.test(
                location
              );
              break;
            case "chungcheong":
              matchesRegion = /충청|충북|충남|대전|chungcheong|daejeon/i.test(
                location
              );
              break;
            case "gyeongsang":
              matchesRegion =
                /경상|경북|경남|대구|울산|gyeongsang|daegu|ulsan/i.test(
                  location
                );
              break;
            case "busan":
              matchesRegion = /부산|busan/i.test(location);
              break;
            case "jeju":
              matchesRegion = /제주|jeju/i.test(location);
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
    (programName) => {
      if (!isLoggedIn) {
        setError(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
        );
        return;
      }

      setSelectedItems((prev) => {
        const isAlreadySelected = prev.includes(programName);
        const newItems = isAlreadySelected
          ? prev.filter((item) => item !== programName)
          : [...prev, programName];

        if (newItems.length > 0) {
          localStorage.setItem("selectedFestivals", JSON.stringify(newItems));
        } else {
          localStorage.removeItem("selectedFestivals");
        }
        return newItems;
      });
    },
    [isLoggedIn]
  );

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const closeError = useCallback(() => {
    setError("");
  }, []);

  const handleLoginClick = useCallback(() => {
    navigate("/login", { state: { from: window.location.pathname } });
    closeError();
  }, [navigate, closeError]);

  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedItems([]);
      localStorage.removeItem("selectedFestivals");
    } else {
      const savedItems = localStorage.getItem("selectedFestivals");
      if (savedItems) {
        try {
          setSelectedItems(JSON.parse(savedItems));
        } catch (error) {
          console.error("저장된 즐겨찾기 불러오기 실패:", error);
          localStorage.removeItem("selectedFestivals");
        }
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && selectedItems.length > 0) {
      localStorage.setItem("selectedFestivals", JSON.stringify(selectedItems));
    }
  }, [selectedItems, isLoggedIn]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="MainFont md:text-5xl text-center sm:text-left text-4xl font-bold text-gray-900 mb-8">
          문화재 행사 정보
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="xl:flex xl:flex-row flex-col justify-between items-start gap-6">
            <div className="xl:w-1/3 w-full">
              <SearchBar value={search} onChange={handleSearchChange} />
            </div>
            <div className="flex flex-wrap gap-2 xl:mt-[6.25rem] mt-4">
              <span className="SubFont text-xl flex items-center font-medium mr-2">
                지역:
              </span>
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`SubFont px-3 py-1 rounded-full text-lg transition-colors
                    ${
                      selectedRegion === region.id
                        ? "bg-blue-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
            <div className="xl:w-1/3 w-full sm:flex flex justify-center mt-6 xl:mt-0">
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full rounded-lg shadow-sm"
                locale="ko-KR"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="MainFont md:text-3xl text-2xl font-semibold mb-6">
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
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={closeError}
              />
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           bg-white rounded-lg shadow-xl z-50 w-96 p-6"
              >
                <p className="text-lg font-semibold text-center mb-6 whitespace-pre-line">
                  {error}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleLoginClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                             transition-colors duration-200"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={closeError}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                             transition-colors duration-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </>
          )}

          {!loading && !fetchError && !error && (
            <ul className="SubFont text-3xl space-y-4">
              {formattedFestivals.length > 0 ? (
                formattedFestivals.map((festival, index) => (
                  <EventItem
                    key={`${festival.programName}-${index}`}
                    event={festival}
                    isStarred={selectedItems.includes(festival.programName)}
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
