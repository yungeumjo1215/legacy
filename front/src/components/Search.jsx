import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AiTwotoneStar } from "react-icons/ai";
import Map from "./map/Map";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 임의로 설정

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // 검색어 입력 시 상태 업데이트
  };

  const handleStarClick = (index) => {
    if (!isLoggedIn) {
      // 로그인하지 않은 상태에서 클릭 시 에러 메시지 표시
      setError(
        "로그인 후 사용하실 수 있습니다.\n회원가입 또는 로그인해주세요."
      );
      return; // 에러가 발생하면 더 이상 클릭하지 않음
    }

    setError(""); // 로그인 상태일 경우 에러 메시지 초기화

    setSelectedItems((prevSelectedItems) => {
      // 항목이 이미 선택되었으면 제거, 아니면 추가
      if (prevSelectedItems.includes(index)) {
        return prevSelectedItems.filter((item) => item !== index); // 선택된 항목을 취소 (false로 변경)
      } else {
        return [...prevSelectedItems, index]; // 새 항목을 선택 (true로 설정)
      }
    });
  };

  // 에러 메시지를 닫는 함수
  const closeError = () => {
    setError("");
  };

  return (
    <div style={{ paddingTop: "4rem", display: "flex", position: "relative" }}>
      {/* Sidebar 컴포넌트 */}
      <div
        style={{
          width: "25%", // 사이드바 너비
          height: "100vh", // 전체 화면 높이
          backgroundColor: "#fff", // 배경색
          color: "black", // 텍스트 색상
          padding: "20px", // 내부 여백
          boxSizing: "border-box", // 테두리와 패딩 포함 크기 계산
          position: "fixed", // 화면에 고정
          top: "4rem", // 상단 여백
          left: 0, // 화면 왼쪽에 맞춤
          borderRight: "1px solid #e2e2e2", // 오른쪽 테두리
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
              width: "80%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid black",
              outline: "none",
              fontSize: "16px",
              color: "black",
            }}
          />
          <button
            className="border-solid border-2 p-1.5 ml-2 hover:bg-black hover:text-white"
            style={{
              height: "45px", // input 높이와 동일하게 설정
              padding: "20px", // 동일한 내부 여백
              borderRadius: "5px", // 둥근 모서리
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid black",
            }}
          >
            <FaSearch className="text-2xl" />
          </button>
        </div>

        {/* 나머지 콘텐츠 영역 */}
        <div
          style={{
            maxHeight: "calc(100vh - 80px)", // 검색창을 제외한 나머지 영역에 스크롤 적용
            overflowY: "auto", // 콘텐츠가 많으면 스크롤
          }}
        >
          <ul>
            {/* 문화재 목록 */}
            {["문화재 1", "문화재 2", "문화재 3", "문화재 4", "문화재 5"].map(
              (item, index) => (
                <li key={index} style={{ margin: "10px 0", display: "flex" }}>
                  {/* 아이콘과 텍스트 */}
                  <div
                    onClick={() => handleStarClick(index)} // 아이콘 클릭 시 색상 변경
                    style={{
                      cursor: "pointer", // 마우스 커서가 손 모양으로 바뀌게
                      marginRight: "10px", // 아이콘과 텍스트 간격
                      display: "inline-block",
                      color: selectedItems.includes(index) ? "yellow" : "gray", // 선택된 항목은 노란색
                    }}
                  >
                    <AiTwotoneStar className="text-3xl" />
                  </div>
                  <div>{item}</div>
                </li>
              )
            )}
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
          {/* 오버레이 */}
          <div
            style={{
              position: "fixed", // 화면 전체를 차지
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 어두운 반투명 배경
              zIndex: 9999, // 팝업보다 아래에 표시
            }}
            onClick={closeError} // 클릭 시 에러 팝업 닫기
          />
          {/* 팝업 */}
          <div
            style={{
              position: "fixed", // 화면 중앙에 고정
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#e2e2e2",
              color: "black",
              padding: "20px",
              borderRadius: "8px",
              zIndex: 10000, // 오버레이 위에 표시
              width: "400px", // 가로 크기 적당히 줄임
              height: "200px", // 세로 크기 적당히 줄임
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // 수직 중앙 정렬
              alignItems: "center", // 수평 중앙 정렬
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontWeight: "bold", // 에러 문구 굵게 처리
                fontSize: "18px", // 폰트 크기 살짝 증가
                whiteSpace: "pre-wrap",
              }}
            >
              {error}
            </p>
            <button
              onClick={closeError} // 에러 메시지 닫기
              style={{
                backgroundColor: "#121a35",
                color: "white",
                border: "none",
                padding: "8px 16px", // 버튼 내부 여백 줄이기
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "40px",
              }}
            >
              닫기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
