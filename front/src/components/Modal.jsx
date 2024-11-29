// Modal.jsx
import React from "react";

const Modal = ({ item, onClose }) => {
  return (
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
      onClick={onClose} // 모달 외부 클릭 시 닫기
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          color: "black",
          padding: "30px", // padding을 늘려서 여백을 좀 더 추가
          borderRadius: "8px",
          zIndex: 10000,
          width: "800px", // 모달 너비를 800px로 늘림
          height: "800px", // 모달 높이를 600px로 늘림
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        <h2
          style={{ fontSize: "28px", marginBottom: "20px", fontWeight: "bold" }}
        >
          {item.ccbaMnm1} {/* 유적지 이름 */}
        </h2>
        <img
          src={item.imageUrl} // 유적지 이미지 URL
          alt={item.ccbaMnm1}
          style={{
            width: "100%",
            borderRadius: "8px",
            marginBottom: "20px", // 이미지 아래 여백 추가
            maxHeight: "350px", // 이미지 최대 높이를 350px로 제한
            objectFit: "cover", // 이미지가 잘리거나 왜곡되지 않도록
          }}
        />
        <p
          style={{
            fontSize: "18px",
            marginBottom: "20px",
            boxSizing: "border-box",
            border: "1px solid gray",
            padding: "10px",
          }}
        >
          {item.content} {/* 유적지 설명 */}
        </p>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          <strong>위치:</strong> {item.ccbaLcad} {/* 유적지 위치 */}
        </p>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          <strong>시대:</strong> {item.ccceName} {/* 유적지 이름 */}
        </p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: "#121a35",
            color: "white",
            border: "none",
            padding: "12px 25px", // 버튼 크기 키움
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            display: "flex", // flexbox를 사용하여 정렬
            justifyContent: "center", // 가로로 가운데 정렬
            width: "100%", // 버튼의 너비를 100%로 설정하여 부모 요소 안에서 가로로 가운데 배치
            alignItems: "center", // 버튼 내용 가로 세로 모두 가운데로 정렬
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
