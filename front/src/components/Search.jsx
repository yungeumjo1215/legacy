import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [heritageData, setHeritageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const saved = localStorage.getItem("selectedHeritages");
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState("");
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  // 즐겨찾기 상태 저장
  useEffect(() => {
    if (isLoggedIn && selectedItems.length > 0) {
      localStorage.setItem("selectedHeritages", JSON.stringify(selectedItems));
    }
  }, [selectedItems, isLoggedIn]);

  // 로그인 상태 변경 시 즐겨찾기 처리
  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedItems([]);
      localStorage.removeItem("selectedHeritages");
    } else {
      const saved = localStorage.getItem("selectedHeritages");
      if (saved) {
        try {
          setSelectedItems(JSON.parse(saved));
        } catch (error) {
          console.error("저장된 즐겨찾기 불러오기 실패:", error);
          localStorage.removeItem("selectedHeritages");
        }
      }
    }
  }, [isLoggedIn]);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 디바운스된 검색어로 검색 실행
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
        const response = await axios.get("http://localhost:8000/heritage", {
          signal: controller.signal,
        });

        if (!response.data) {
          throw new Error("데이터를 불러오는데 실패했습니다");
        }

        const slicedData = response.data.slice(0, 10); // 문화재 갯수 조절
        setHeritageData(slicedData);
        setFilteredData(slicedData);
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

  // 검색 결과 메모이제이션
  const filteredResults = useMemo(() => {
    return heritageData.filter((item) =>
      item.ccbaMnm1.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    setIsSidebarOpen(false); // 모바일에서 항목 선택 시 사이드바 닫기

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: item.ccbaLcad,
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

  const handleStarClick = useCallback(
    (heritage) => {
      if (!isLoggedIn) {
        setError(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
        );
        return;
      }

      const isAlreadySelected = selectedItems.includes(heritage.ccbaMnm1);

      if (isAlreadySelected) {
        dispatch(
          removeFavorite({
            ...heritage,
            id: heritage.ccbaKdcd, // id 필드 추가
            type: "heritage",
          })
        );
        setSuccessMessage("즐겨찾기가 해제되었습니다.");
      } else {
        dispatch(
          addFavorite({
            ...heritage,
            id: heritage.ccbaKdcd, // id 필드 추가
            type: "heritage",
          })
        );
        setSuccessMessage("즐겨찾기에 추가되었습니다.");
      }

      setSelectedItems((prev) => {
        const newItems = isAlreadySelected
          ? prev.filter((item) => item !== heritage.ccbaMnm1)
          : [...prev, heritage.ccbaMnm1];
        localStorage.setItem("selectedHeritages", JSON.stringify(newItems));
        return newItems;
      });
    },
    [isLoggedIn, selectedItems, dispatch]
  );

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

  // 로그인 상태 변경 시 즐겨찾기 동기화
  useEffect(() => {
    const loadFavorites = async () => {
      if (isLoggedIn) {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (userId && token) {
          try {
            const response = await axios.get(`/favorites/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const heritageNames = response.data
              .filter((fav) => fav.type === "heritage")
              .map((fav) => fav.ccbaMnm1);
            setSelectedItems(heritageNames);
          } catch (error) {
            console.error("즐겨찾기 목록 로드 중 오류:", error);
          }
        }
      } else {
        setSelectedItems([]);
        localStorage.removeItem("selectedHeritages");
      }
    };

    loadFavorites();
  }, [isLoggedIn]);

  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 left-4 z-20 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 md:hidden"
        aria-label="사이드바 토글"
      >
        <MenuIcon className="text-xl" />
      </button>

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
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
        {/* 검색 입력 영역 */}
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
            className="h-[40px] md:h-[45px] p-3 md:p-5 rounded border border-[#77767c] ml-2 flex items-center justify-center hover:bg-[#191934] hover:text-white"
            onClick={handleSearch}
            aria-label="검색하기"
          >
            <FaSearch className="text-xl md:text-2xl" />
          </button>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-sm md:text-base">
              데이터를 불러오는 중...
            </div>
          ) : (
            <ul>
              {filteredData.map((item, index) => (
                <li key={index} className="my-3 md:my-5 flex items-center">
                  <div
                    onClick={() => handleStarClick(item)}
                    className={`cursor-pointer mr-2 md:mr-2.5 ${
                      selectedItems.includes(index)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.ccbaMnm1} 즐겨찾기 ${
                      selectedItems.includes(index) ? "해제" : "추가"
                    }`}
                  >
                    <TiStarFullOutline className="text-2xl md:text-3xl" />
                  </div>
                  <button
                    onClick={() => handleHeritageClick(item)}
                    aria-label={`${item.ccbaMnm1} 상세정보 보기`}
                    className="text-sm md:text-base hover:text-blue-600 transition-colors"
                  >
                    {item.ccbaMnm1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 지도 영역 */}
      <div
        className={`
        flex-grow 
        ml-0 md:ml-[320px] lg:ml-[380px]
        h-screen
        transition-all duration-300 ease-in-out
      `}
      >
        <Map selectedLocation={selectedLocation} />
      </div>

      {/* 에러 모달 */}
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

      {/* 성공 메시지 모달 */}
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

      {/* 상세 정보 모달 */}
      {modalOpen && selectedHeritage && (
        <Modal item={selectedHeritage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SearchPage;
