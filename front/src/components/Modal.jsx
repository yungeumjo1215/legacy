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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // 수평 중앙 정렬
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              margin: 0, // margin-bottom 제거하여 X 버튼과 같은 라인에 위치시킴
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {item.ccbaMnm1} {/* 유적지 이름 */}
          </h2>
          <button
            onClick={onClose} // 닫기 버튼 기능
            style={{
              backgroundColor: "#121a35",
              color: "white",
              padding: "3px 15px", // 버튼 크기 키움
              border: "none",
              fontSize: "25px", // X 크기
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "20px", //
            }}
          >
            X
          </button>
        </div>
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
            border: "1px solid #7d7576",
            borderRadius: "8px",
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
      </div>
    </div>
  );
};

export default Modal;
