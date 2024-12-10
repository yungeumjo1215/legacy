import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import axios from "axios";
import Map from "./map/Map";
import Modal from "./Modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";

const SearchPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { heritages } = useSelector((state) => state.favorites);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
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

        const slicedData = response.data.slice(0, 100);
        setHeritageData(slicedData);
        setFilteredData(slicedData);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);
        setError("데이���를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGetHeritageData();

    return () => controller.abort();
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchTerm) return heritageData;

    return heritageData.filter((item) => {
      if (!item || !item.ccbamnm1) return false;
      return item.ccbamnm1.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [heritageData, searchTerm]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(heritageData);
    } else {
      setFilteredData(filteredResults);
    }
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
      id: item.ccbakdcd,
      type: "heritage",
      title: item.ccbamnm1,
      imageUrl: item.imageurl || item.ccbaasno,
      location: item.ccbalcad,
      content: item.content || item.ccbactcd,
    };

    const filtered = recentItems.filter((recent) => recent.id !== newItem.id);
    const updated = [newItem, ...filtered].slice(0, 5);
    localStorage.setItem("recentItems", JSON.stringify(updated));

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: item.ccbalcad,
            key: process.env.REACT_APP_GOOGLE_MAPS_API,
          },
        }
      );

      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        setSelectedLocation({ lat, lng });
      }
    } catch (error) {
      console.error("위치 정보 변환 중 오류 발생:", error);
    }
  };

  const isFavorite = (item) => {
    return heritages.some((heritage) => heritage.ccbamnm1 === item.ccbamnm1);
  };

  const handleStarClick = async (heritage) => {
    if (!isLoggedIn) {
      setError(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      return;
    }

    const isAlreadySelected = isFavorite(heritage);

    try {
      if (isAlreadySelected) {
        dispatch(
          removeFavorite({
            type: "heritage",
            id: heritage.ccbamnm1,
          })
        );
      } else {
        const heritageData = {
          type: "heritage",
          id: heritage.ccbamnm1,
          ccbamnm1: heritage.ccbamnm1,
          ccbalcad: heritage.ccbalcad,
          content: heritage.content || heritage.ccbactcd,
          imageurl: heritage.imageurl || heritage.ccbaasno,
          ccbakdcd: heritage.ccbakdcd,
          ccceName: heritage.ccceName,
        };

        dispatch(addFavorite(heritageData));
      }

      handleFavoriteChange(heritage.ccbaKdcd, !isAlreadySelected);

      setSuccessMessage(
        isAlreadySelected
          ? "즐겨찾기가 해제되었습니다."
          : "즐겨찾기에 추가되었습니다."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류 발생:", error);
      setError("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const closeError = () => {
    setError("");
  };

  const handleLoginClick = () => {
    navigate("/login");
    closeError();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHeritage(null);
  };

  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleFavoriteChange = (id, isFavorite) => {
    const updatedData = filteredData.map((item) => {
      if (item.ccbaKdcd === id) {
        return { ...item, isFavorite };
      }
      return item;
    });
    setFilteredData(updatedData);
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
        overflow-y-auto 
        flex flex-col 
        gap-3 md:gap-5
        z-40
        transition-all duration-300 ease-in-out
      `}
      >
        <div className="mb-3 md:mb-5 flex">
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
            className="h-[40px] md:h-[45px] p-3 md:p-5 rounded border border-[#77767c] ml-2 flex items-center justify-center MainColor text-white hover:bg-blue-700 hover:text-white"
            onClick={handleSearch}
            aria-label="���색하기"
          >
            <FaSearch className="text-xl md:text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-sm md:text-base SubFont">
              데이터를 불러오는 중...
            </div>
          ) : (
            <ul>
              {filteredData.map((item, index) => (
                <li
                  key={item.ccbakdcd || index}
                  className="my-3 md:my-5 flex items-center"
                >
                  <div
                    onClick={() => handleStarClick(item)}
                    className={`cursor-pointer mr-2 md:mr-2.5 ${
                      isFavorite(item) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.ccbamnm1} 즐겨찾기 ${
                      isFavorite(item) ? "해제" : "추가"
                    }`}
                  >
                    <TiStarFullOutline className="text-2xl md:text-3xl" />
                  </div>
                  <button
                    onClick={() => handleHeritageClick(item)}
                    aria-label={`${item.ccbamnm1} 상세정보 보기`}
                    className="text-sm md:text-base hover:text-blue-600 transition-colors"
                  >
                    {item.ccbamnm1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
