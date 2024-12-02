import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import axios from "axios";
import Map from "./map/Map";
import Modal from "./Modal";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [heritageData, setHeritageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 디바운스된 검어로 검색 실행
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

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
    setFilteredData(filteredResults);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHeritageClick = async (item) => {
    setSelectedHeritage(item);
    setModalOpen(true);

    try {
      // Google Geocoding API를 사용하여 주소를 좌표로 변환
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

  const handleStarClick = (index) => {
    if (!isLoggedIn) {
      setError(
        "로그인 후 사용하실 수 있습니다.\n회원가입 또는 로그인해주세요."
      );
      return;
    }

    setError("");
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(index)
        ? prevSelectedItems.filter((item) => item !== index)
        : [...prevSelectedItems, index]
    );
  };

  const closeError = () => {
    setError("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHeritage(null);
  };

  return (
    <div className="pt-16 flex relative">
      <div className="w-1/4 h-screen bg-white text-black p-5 box-border fixed top-16 left-2.5 border-r border-[#e2e2e2] shadow-md overflow-y-auto flex flex-col gap-5">
        <div className="mb-5 flex">
          <input
            type="text"
            placeholder="문화재를 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="문화재 검색"
            className="w-full p-2 rounded border border-[#77767c] text-base"
          />
          <button
            className="h-[45px] p-5 rounded border border-[#77767c] ml-2 flex items-center justify-center hover:bg-[#191934] hover:text-white"
            onClick={handleSearch}
            aria-label="검색하기"
          >
            <FaSearch className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div>데이터를 불러오는 중...</div>
          ) : (
            <ul>
              {filteredData.map((item, index) => (
                <li key={index} className="my-5 flex">
                  <div
                    onClick={() => handleStarClick(index)}
                    className={`cursor-pointer mr-2.5 ${
                      selectedItems.includes(index)
                        ? "text-[#FFD700]"
                        : "text-[#DCDCDC]"
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.ccbaMnm1} 즐겨찾기 ${
                      selectedItems.includes(index) ? "해제" : "추가"
                    }`}
                  >
                    <TiStarFullOutline className="text-3xl" />
                  </div>
                  <button
                    onClick={() => handleHeritageClick(item)}
                    aria-label={`${item.ccbaMnm1} 상세정보 보기`}
                  >
                    {item.ccbaMnm1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex-grow ml-[25%]">
        <Map selectedLocation={selectedLocation} />
      </div>

      {error && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={closeError}
          />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#e2e2e2] text-black p-5 rounded-lg z-[10000] w-[400px] h-[200px] flex flex-col justify-center items-center text-center"
            role="alert"
          >
            <p className="font-bold text-lg whitespace-pre-wrap mt-5">
              {error}
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </button>
              <button
                onClick={closeError}
                className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && selectedHeritage && (
        <Modal item={selectedHeritage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SearchPage;
