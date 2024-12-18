import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import axios from "axios";
import Map from "./map/Map";
import Modal from "./Modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import {
  addFavorite,
  removeFavorite,
  setFavorites,
} from "../redux/slices/favoriteSlice";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [heritageData, setHeritageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setFilteredData([]);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    } else {
      setFilteredData(heritageData);
    }
  }, [debouncedSearchTerm, heritageData]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGetHeritageData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/pgdb/heritage",
          {
            signal: controller.signal,
          }
        );

        if (!response.data) {
          throw new Error("데이터를 불러오는데 실패했습니다");
        }

        setHeritageData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);

        setError("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGetHeritageData();

    return () => controller.abort();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/pgdb/favoritelist",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setFavorites(response.data));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (location.state?.selectedEvent) {
      const heritage = {
        ccbamnm1: location.state.selectedEvent.title,
        ccbalcad: location.state.selectedEvent.location,
        content: location.state.selectedEvent.content,
        imageurl: location.state.selectedEvent.imageUrl,
        id: location.state.selectedEvent.id,
      };

      setSelectedHeritage(heritage);
      setModalOpen(true);

      const fetchLocation = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                address: heritage.lat + "," + heritage.lng,
                key: process.env.REACT_APP_GOOGLE_MAPS_API,
              },
            }
          );
        } catch (error) {
          console.error("위치 정보 변경 중 오류 발생:", error);
        }
      };

      fetchLocation();
    }
  }, [location.state]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData([...heritageData]);
    } else {
      setFilteredData([]);

      const searchTermLower = searchTerm.trim().toLowerCase();
      const newFilteredData = heritageData.filter((item) => {
        if (!item || !item.ccbamnm1) return false;
        return item.ccbamnm1.toLowerCase().includes(searchTermLower);
      });

      setTimeout(() => {
        setFilteredData([...newFilteredData]);
      }, 100);
    }
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHeritageClick = async (item) => {
    setSelectedHeritage(item);
    setModalOpen(true);
    setIsSidebarOpen(false);

    const recentItems = JSON.parse(localStorage.getItem("recentItems")) || [];
    const newItem = {
      id: item.heritageid || item.문화재id,
      type: "heritage",
      title: item.ccbamnm1,
      imageurl: item.imageurl,
      location: item.ccbalcad,
      content: item.content,
      lat: item.lat,
      lng: item.lng,
    };

    const filtered = recentItems.filter((recent) => recent.id !== newItem.id);
    const updated = [newItem, ...filtered].slice(0, 5);
    localStorage.setItem("recentItems", JSON.stringify(updated));

    if (item.lat && item.lng) {
      setSelectedLocation({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
      });
    }
  };

  const isFavorite = (item) => {
    return favorites.heritages.some((h) => h.heritageid === item.heritageid);
  };

  const handleStarClick = async (heritage) => {
    if (!isLoggedIn) {
      setAlertMessage(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      return;
    }

    const token = localStorage.getItem("token");
    const isCurrentlyFavorite = isFavorite(heritage);

    try {
      if (!isCurrentlyFavorite) {
        await axios.post(
          "http://localhost:8000/pgdb/favoritelist",
          { id: heritage.heritageid, type: "heritage" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(addFavorite({ type: "heritage", data: heritage }));
        setAlertMessage("즐겨찾기에 추가되었습니다.");
      } else {
        await axios.delete("http://localhost:8000/pgdb/favoritelist", {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: heritage.heritageid, type: "heritage" },
        });
        dispatch(removeFavorite({ type: "heritage", id: heritage.heritageid }));
        setAlertMessage("즐겨찾기가 해제되었습니다.");
      }

      await fetchFavorites();
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류 발생:", error);
      setAlertMessage("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
  };

  const handleLoginClick = () => {
    navigate("/login");
    closeAlert();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHeritage(null);
  };

  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleFavoriteChange = (id, isFavorite) => {
    const updatedData =
      Array.isArray(filteredData) &&
      filteredData.map((item) => {
        if (item.ccbakdcd === id) {
          return { ...item, isFavorite };
        }
        return item;
      });
    setFilteredData(updatedData || []);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      uniqueId: `${item.ccbakdcd}_${startIndex + index}`,
    }));
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 left-4 z-20 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 md:hidden"
        aria-label="사이드바 토글"
      >
        <MenuIcon className="text-xl" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
        w-[280px] md:w-[320px] lg:w-[380px]
        h-screen
        bg-white text-black p-3 md:p-5 
        box-border 
        fixed 
        top-16
        ${isSidebarOpen ? "left-0" : "-left-full"} md:left-0
        border-r border-[#e2e2e2] 
        shadow-md         
        flex flex-col 
        gap-1 md:gap-1
        z-40
        transition-all duration-300 ease-in-out
      `}
      >
        <div className="mb-1 md:mb-2 flex">
          <input
            type="text"
            placeholder="문화재를 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="문화재 검색"
            className="w-full p-2 rounded border border-[#77767c] text-sm md:text-base"
          />
          <button
            className="h-[40px] md:h-[45px] p-3 md:p-5 rounded border border-[#77767c] ml-2 flex items-center justify-center MainColor text-white hover:animate-[push_0.3s_linear_1] hover:bg-blue-700"
            onClick={handleSearch}
            aria-label="검색하기"
          >
            <FaSearch className="text-xl md:text-2xl" />
          </button>
        </div>

        <div className="flex-1  pb-16">
          {isLoading ? (
            <div className="text-center text-sm md:text-base SubFont">
              데이터를 불러오는 중...
            </div>
          ) : (
            <ul className="h-auto">
              {getCurrentPageData().map((item, index) => (
                <li
                  key={item.uniqueId}
                  className="my-3 md:my-5 flex items-center opacity-0 animate-[slideDown_0.25s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    onClick={() => handleStarClick(item)}
                    className={`cursor-pointer mr-2 md:mr-2.5 ${
                      isFavorite(item) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <TiStarFullOutline className="text-2xl md:text-3xl" />
                  </div>
                  <button
                    onClick={() => handleHeritageClick(item)}
                    className="text-sm md:text-base hover:text-blue-600 transition-colors truncate max-w-[350px] text-left"
                  >
                    {item.ccbamnm1}
                  </button>
                  <div className="text-xs text-gray-500 ml-2"></div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {filteredData.length > 0 && (
          <div
            className={`fixed bottom-0 ${
              isSidebarOpen ? "left-0" : "-left-full"
            } md:left-0 w-[280px] md:w-[320px] lg:w-[380px] bg-white border-t border-[#e2e2e2] py-4 transition-all duration-300`}
          >
            <div className="flex justify-center items-center gap-1 px-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`min-w-[40px] px-2 py-1 text-sm rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                이전
              </button>

              <div className="flex gap-2 p-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-7 h-7 text-sm rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-700 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`min-w-[40px] px-2 py-1 text-sm rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-200"
                }`}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`
        flex-grow 
        ml-0 md:ml-[320px] lg:ml-[380px]
        h-[93vh]
        transition-all duration-300 ease-in-out
      `}
      >
        <Map selectedLocation={selectedLocation} />
      </div>

      {alertMessage && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={closeAlert}
          />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-[#e2e2e2] text-black p-4 md:p-5 rounded-lg z-[10000] 
                     w-[90%] md:w-[400px] max-w-[400px]
                     h-[180px] md:h-[200px] 
                     flex flex-col justify-center items-center text-center"
            role="alert"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-base md:text-lg whitespace-pre-wrap mt-4 md:mt-5">
              {alertMessage}
            </p>
            <div className="mt-4 md:mt-6 flex gap-2 md:gap-2.5">
              {alertMessage.includes("로그인이 필요한 서비스입니다") ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                             cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={closeAlert}
                    className="bg-gray-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                             cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    닫기
                  </button>
                </>
              ) : (
                <button
                  onClick={closeAlert}
                  className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                           cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  확인
                </button>
              )}
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
              className="mt-4 md:mt-6 bg-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                       cursor-pointer hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        </>
      )}

      {modalOpen && selectedHeritage && (
        <Modal
          item={selectedHeritage}
          onClose={handleCloseModal}
          onFavoriteChange={handleFavoriteChange}
        />
      )}
    </div>
  );
};

export default SearchPage;
