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
          padding: "20px",
          borderRadius: "8px",
          zIndex: 10000,
          width: "600px",
          height: "400px",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          {item.ccbaMnm1} {/* 유적지 이름 */}
        </h2>
        <p>
          <strong>설명:</strong> {item.ccbaMnm1}에 대한 설명이 이곳에
          표시됩니다.
        </p>
        <p>
          <strong>위치:</strong> {item.ccbaAddr1} {/* 유적지 주소 */}
        </p>
        <p>
          <strong>유적지 ID:</strong> {item.ccbaId} {/* 유적지 ID */}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#121a35",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
