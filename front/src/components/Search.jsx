import React, { useState, useEffect } from "react"; // React 및 상태 관리 Hook 임포트
import { FaSearch } from "react-icons/fa"; // 검색 아이콘
import { TiStarFullOutline } from "react-icons/ti"; // 별표 아이콘
import axios from "axios"; // HTTP 요청 라이브러리
import Map from "./map/Map"; // 지도 컴포넌트
import Modal from "./Modal"; // Modal 컴포넌트 임포트

const SearchPage = () => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [heritageData, setHeritageData] = useState([]); // 전체 유적지 데이터 상태
  const [filteredData, setFilteredData] = useState([]); // 검색어에 따른 필터링된 데이터
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [selectedHeritage, setSelectedHeritage] = useState(null); // 선택된 유적지 정보 상태

  // 컴포넌트가 처음 렌더링될 때 실행되는 useEffect
  useEffect(() => {
    // 유적지 데이터를 가져오는 함수
    const fetchGetHeritageData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/heritage"); // API 호출
        const slicedData = response.data.slice(0, 30); // 0번째부터 30번째까지 데이터만 사용
        setHeritageData(slicedData); // 상태에 전체 데이터 저장
        setFilteredData(slicedData); // 초기에는 필터링된 데이터도 동일하게 설정
      } catch (error) {
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error); // 에러 처리
      }
    };

    fetchGetHeritageData(); // 데이터 가져오기 호출
  }, []); // 컴포넌트 마운트 시 한 번 실행

  // 검색어 변경 시 호출되는 함수
  const handleSearch = () => {
    // 검색어에 따라 데이터 필터링
    const filtered = heritageData.filter(
      (item) => item.ccbaMnm1.toLowerCase().includes(searchTerm.toLowerCase()) // 검색어와 이름 비교
    );
    setFilteredData(filtered); // 필터링된 데이터 상태 업데이트
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // 엔터키 눌렀을 때 검색 실행
    }
  };

  // 유적지 이름 클릭 시 모달 열기
  const handleHeritageClick = (item) => {
    setSelectedHeritage(item); // 선택된 유적지 정보 저장
  };

  // 별표 클릭 시 호출되는 함수
  const handleStarClick = (index) => {
    if (!isLoggedIn) {
      // 로그인 상태가 아니면 에러 메시지 표시
      setError(
        "로그인 후 사용하실 수 있습니다.\n회원가입 또는 로그인해주세요."
      );
      return;
    }

    setError(""); // 에러 메시지 초기화

    // 선택된 항목 상태 업데이트
    setSelectedItems(
      (prevSelectedItems) =>
        prevSelectedItems.includes(index)
          ? prevSelectedItems.filter((item) => item !== index) // 이미 선택된 경우 제거
          : [...prevSelectedItems, index] // 선택되지 않은 경우 추가
    );
  };

  // 에러 메시지를 닫는 함수
  const closeError = () => {
    setError(""); // 에러 메시지 초기화
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedHeritage(null); // 모달 닫기
  };

  return (
    <div style={{ paddingTop: "4rem", display: "flex", position: "relative" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "24.5%",
          height: "100vh",
          backgroundColor: "#fff",
          color: "black",
          padding: "20px",
          boxSizing: "border-box",
          position: "fixed",
          top: "4rem",
          left: "10px",
          borderRight: "1px solid #e2e2e2",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 검색창 */}
        <div style={{ marginBottom: "20px", display: "flex" }}>
          <input
            type="text"
            placeholder="문화재를 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 입력 시 상태 업데이트
            onKeyPress={handleKeyPress} // 엔터키 입력 시 검색 실행
            style={{
              width: "80%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #77767c",
              fontSize: "16px",
            }}
          />
          <button
            className="border-solid border-2 p-1.5 ml-2 hover:bg-[#191934] hover:text-white"
            style={{
              height: "45px",
              padding: "20px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #77767c",
            }}
            onClick={handleSearch} // 검색 아이콘 클릭 시 검색 실행
          >
            <FaSearch className="text-2xl" />
          </button>
        </div>

        {/* 유적지 목록 */}
        <div
          style={{
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <ul>
            {filteredData.map((item, index) => (
              <li key={index} style={{ margin: "20px 0", display: "flex" }}>
                <div
                  onClick={() => handleStarClick(index)}
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: selectedItems.includes(index)
                      ? "#FFD700"
                      : "#DCDCDC",
                  }}
                >
                  <TiStarFullOutline className="text-3xl" />
                </div>
                <button
                  onClick={() => handleHeritageClick(item)} // 유적지 이름 클릭 시 모달 열기
                >
                  {item.ccbaMnm1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map 컴포넌트 */}
      <div style={{ flexGrow: 1, marginLeft: "25%" }}>
        <Map />
      </div>

      {/* 에러 메시지 및 오버레이 */}
      {error && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
            onClick={closeError}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#e2e2e2",
              color: "black",
              padding: "20px",
              borderRadius: "8px",
              zIndex: 10000,
              width: "400px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                whiteSpace: "pre-wrap",
                marginTop: "20px",
              }}
            >
              {error}
            </p>
            <button
              onClick={closeError}
              style={{
                backgroundColor: "#121a35",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "25px",
              }}
            >
              닫기
            </button>
          </div>
        </>
      )}

      {/* 모달 */}
      {selectedHeritage && (
        <Modal item={selectedHeritage} onClose={closeModal} />
      )}
    </div>
  );
};

export default SearchPage;
