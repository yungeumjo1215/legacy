import React, { useState, useEffect } from "react"; // React 및 상태 관리 Hook 임포트
import { FaSearch } from "react-icons/fa"; // 검색 아이콘
import { TiStarFullOutline } from "react-icons/ti"; // 별표 아이콘
import axios from "axios"; // HTTP 요청 라이브러리
import Map from "./map/Map"; // 지도 컴포넌트

const SearchPage = () => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [heritageData, setHeritageData] = useState([]); // 전체 유적지 데이터 상태
  const [filteredData, setFilteredData] = useState([]); // 검색어에 따른 필터링된 데이터
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

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
  const handleSearch = (event) => {
    const term = event.target.value; // 입력된 검색어
    setSearchTerm(term); // 검색어 상태 업데이트

    // 검색어에 따라 데이터 필터링
    const filtered = heritageData.filter(
      (item) => item.ccbaMnm1.toLowerCase().includes(term.toLowerCase()) // 검색어와 이름 비교
    );
    setFilteredData(filtered); // 필터링된 데이터 상태 업데이트
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

  return (
    <div style={{ paddingTop: "4rem", display: "flex", position: "relative" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "24.5%", // 사이드바 너비
          height: "100vh", // 전체 화면 높이
          backgroundColor: "#fff", // 배경색
          color: "black", // 텍스트 색상
          padding: "20px", // 내부 여백
          boxSizing: "border-box", // 테두리와 패딩 포함 크기 계산
          position: "fixed", // 화면에 고정
          top: "4rem", // 상단 여백
          left: "10px", // 왼쪽 여백
          borderRight: "1px solid #e2e2e2", // 오른쪽 테두리
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 효과
        }}
      >
        {/* 검색창 */}
        <div style={{ marginBottom: "20px", display: "flex" }}>
          <input
            type="text"
            placeholder="문화재를 입력해주세요."
            value={searchTerm} // 검색어 상태 바인딩
            onChange={handleSearch} // 검색어 변경 시 처리
            style={{
              width: "80%", // 입력창 너비
              padding: "10px", // 내부 여백
              borderRadius: "5px", // 둥근 모서리
              border: "1px solid #77767c", // 테두리
              fontSize: "16px", // 텍스트 크기
            }}
          />
          <button
            className="border-solid border-2 p-1.5 ml-2 hover:bg-[#191934] hover:text-white"
            style={{
              height: "45px", // 버튼 높이
              padding: "20px", // 내부 여백
              borderRadius: "5px", // 둥근 모서리
              display: "flex",
              alignItems: "center", // 수직 정렬
              justifyContent: "center", // 수평 정렬
              border: "1px solid #77767c", // 테두리
            }}
          >
            <FaSearch className="text-2xl" /> {/* 검색 아이콘 */}
          </button>
        </div>

        {/* 유적지 목록 */}
        <div
          style={{
            maxHeight: "calc(100vh - 80px)", // 검색창을 제외한 영역 높이
            overflowY: "auto", // 스크롤 허용
          }}
        >
          <ul>
            {filteredData.map((item, index) => (
              <li key={index} style={{ margin: "20px 0", display: "flex" }}>
                <div
                  onClick={() => handleStarClick(index)} // 별표 클릭 처리
                  style={{
                    cursor: "pointer", // 마우스 커서 변경
                    marginRight: "10px", // 간격
                    color: selectedItems.includes(index)
                      ? "#FFD700" // 선택된 항목은 노란색
                      : "#DCDCDC", // 선택되지 않은 항목은 회색
                  }}
                >
                  <TiStarFullOutline className="text-3xl" /> {/* 별표 아이콘 */}
                </div>
                <div>{item.ccbaMnm1}</div> {/* 유적지 이름 출력 */}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map 컴포넌트 */}
      <div style={{ flexGrow: 1, marginLeft: "25%" }}>
        <Map /> {/* 지도 렌더링 */}
      </div>

      {/* 에러 메시지 및 오버레이 */}
      {error && (
        <>
          {/* 오버레이 */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
              zIndex: 9999, // 팝업 뒤에 표시
            }}
            onClick={closeError} // 클릭 시 에러 팝업 닫기
          />
          {/* 에러 팝업 */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#e2e2e2", // 팝업 배경색
              padding: "20px",
              borderRadius: "8px", // 둥근 모서리
              zIndex: 10000, // 팝업 위에 표시
              width: "400px",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>{error}</p> {/* 에러 메시지 출력 */}
            <button onClick={closeError}>닫기</button> {/* 닫기 버튼 */}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
