import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TiStarFullOutline } from "react-icons/ti";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import EventModal from "../components/events/EventModal";
import "../components/events/EventSchedule.css";
import {
  addFavorites,
  deleteFavorites,
  fetchFavorites,
  addToList,
  removeFromList,
  setFavorites,
} from "../redux/slices/favoriteSlice";
import default_Img from "../assets/festival.png";

// 새로운 import 경로들
import { REGIONS } from "./events/constants/holidayConstants";
import { filterFestivals } from "./events/filters/festivalFilters";
import {
  formatValue,
  tileClassName,
  formatFestivalData,
  handleImageError,
} from "./events/utils/utilsExport";
import SearchBar from "./events/ui/SearchBar";
import ScrollToTop from "./events/ui/ScrollToTop";
import Pagination from "./events/ui/Pagination";

const EventSchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isEventStarred = useCallback(
    (festivalId) => {
      return (
        Array.isArray(festivals) &&
        festivals.some((festival) => festival.festivalid === festivalId)
      );
    },
    [festivals]
  );

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    dispatch(fetchFestivalData({ year, month }));
  }, [date, dispatch]);

  const filteredFestivals = useMemo(() => {
    return filterFestivals(festivalList, date, search, selectedRegion);
  }, [festivalList, date, search, selectedRegion]);

  const formattedFestivals = useMemo(() => {
    if (!Array.isArray(filteredFestivals)) return [];
    return filteredFestivals.map((festival) => formatFestivalData(festival));
  }, [filteredFestivals]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleRegionSelect = useCallback((region) => {
    setSelectedRegion(region);
  }, []);

  const handleStarClick = useCallback(
    async (festival) => {
      if (!isLoggedIn) {
        setError(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
        );
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const isAlreadySelected = isEventStarred(festival.festivalid);

        if (!isAlreadySelected) {
          await dispatch(
            addFavorites({
              token,
              favoriteId: festival.festivalid,
              type: "event",
            })
          );

          dispatch(
            addToList({
              festivalid: festival.festivalid,
              festivalname: festival.programName,
              programName: festival.programName,
              programContent: festival.programContent,
              startDate: festival.startDate,
              endDate: festival.endDate,
              location: festival.location,
              contact: festival.contact,
              image: festival.image,
              targetAudience: festival.targetAudience,
            })
          );

          setSuccessMessage("즐겨찾기에 추가되었습니다.");
        } else {
          await dispatch(
            deleteFavorites({
              token,
              favoriteId: festival.festivalid,
              type: "event",
            })
          );

          dispatch(removeFromList(festival.festivalid));
          setSuccessMessage("즐겨찾기가 해제되었습니다.");
        }

        // 즐겨찾기 목록 새로고침
        const response = await dispatch(fetchFavorites(token));
        if (response.payload) {
          dispatch(setFavorites(response.payload));
        }

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("즐겨찾기 처리 중 오류 발생:", error);
        setError(`즐겨찾기 처리 중 오류가 발생했습니다: ${error.message}`);
      }
    },
    [isLoggedIn, dispatch, isEventStarred]
  );

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);

    // 최근 본 목록에 추가
    const recentItems = JSON.parse(localStorage.getItem("recentItems")) || [];

    const newItem = {
      id: `event-${event.festivalid}`, // 고유 ID 생성
      type: "event",
      title: event.programName,
      imageUrl: event.image,
      begin_de: event.startDate,
      location: event.location,
      content: event.programContent,
    };

    // 동일한 ID를 가진 항목이 있는지 확인하고 필터링
    const filteredItems = recentItems.filter((item) => item.id !== newItem.id);

    // 새 항목을 배열 앞에 추가하고 최대 5개까지만 유지
    const updatedItems = [newItem, ...filteredItems].slice(0, 5);

    localStorage.setItem("recentItems", JSON.stringify(updatedItems));
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRegion]);

  useEffect(() => {
    if (location.state?.selectedEvent) {
      const event = {
        programName: location.state.selectedEvent.title,
        programContent: location.state.selectedEvent.content,
        startDate: location.state.selectedEvent.begin_de,
        location: location.state.selectedEvent.location,
        image: location.state.selectedEvent.imageUrl,
      };
      setSelectedEvent(event);
    }
  }, [location.state]);

  // 로그인 상태가 변경되거나 컴포넌트가 마운트될 때 즐겨찾기 목록을 가져옵니다
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchFavorites(token))
        .then((response) => {
          if (response.payload) {
            dispatch(setFavorites(response.payload));
          }
        })
        .catch((error) => {
          console.error("즐겨찾기 목록 가져오기 실패:", error);
        });
    }
  }, [dispatch]);

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
                tileClassName={tileClassName}
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
                onClick={(e) => e.stopPropagation()}
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
                    <li
                      key={`${festival.programName}-${index}`}
                      className="my-3 md:my-5 flex items-center opacity-0 animate-[slideDown_0.3s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="border p-4 rounded-lg transition-colors w-full">
                        <div className="flex items-start">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarClick(festival);
                            }}
                            className={`star-button mr-2 sm:mr-3 ${
                              isEventStarred(festival.festivalid)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            tabIndex={0}
                            aria-label={`${festival.programName} 즐겨찾기 ${
                              isEventStarred(festival.festivalid)
                                ? "제거"
                                : "추가"
                            }`}
                          >
                            <TiStarFullOutline className="text-2xl sm:text-3xl" />
                          </button>

                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="MainFont text-xl sm:text-2xl">
                                {festival.programName}
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
                                onClick={() => handleEventClick(festival)}
                              >
                                더보기
                              </button>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                              <div className="lg:max-w-56 w-full">
                                <img
                                  src={
                                    festival.image && festival.image !== "N/A"
                                      ? festival.image
                                      : default_Img
                                  }
                                  alt={festival.programName}
                                  className="w-full h-auto object-cover border rounded-lg"
                                  loading="lazy"
                                  onError={handleImageError}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                                  <div className=" p-2 sm:p-3 rounded-lg">
                                    <p className="SubFont text-base sm:text-lg">
                                      <span className="font-medium mr-2">
                                        행사 내용:
                                      </span>
                                      {formatValue(festival.programContent)}
                                    </p>
                                  </div>
                                  <div className=" p-2 sm:p-3 rounded-lg">
                                    <p className="SubFont text-base sm:text-lg">
                                      <span className="font-medium mr-2">
                                        기간:
                                      </span>
                                      {festival.startDate} ~{" "}
                                      {formatValue(festival.endDate)}
                                    </p>
                                  </div>
                                  <div className=" p-2 sm:p-3 rounded-lg">
                                    <p className="SubFont text-base sm:text-lg">
                                      <span className="font-medium mr-2">
                                        장소:
                                      </span>
                                      {formatValue(festival.location)}
                                    </p>
                                  </div>
                                  <div className=" p-2 sm:p-3 rounded-lg">
                                    <p className="SubFont text-base sm:text-lg">
                                      <span className="font-medium mr-2">
                                        대상:
                                      </span>
                                      {formatValue(festival.targetAudience)}
                                    </p>
                                  </div>
                                  <div className=" p-2 sm:p-3 rounded-lg lg:col-span-2">
                                    <p className="SubFont text-base sm:text-lg">
                                      <span className="font-medium mr-2">
                                        문의:
                                      </span>
                                      {formatValue(festival.contact)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8 text-xl">
                    해당 날짜에 예정된 행사가 없습니다.
                  </p>
                )}
              </ul>
              {formattedFestivals.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    formattedFestivals.length / itemsPerPage
                  )}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
      <ScrollToTop />
    </div>
  );
};

export default memo(EventSchedule);
