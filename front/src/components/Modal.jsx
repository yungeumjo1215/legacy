import React from "react";

const Modal = ({ item, onClose }) => {
  // 이미지 로드 실패 시 대체 이미지 사용
  const handleImageError = (e) => {
    e.target.src = "/default-image.jpg"; // 기본 이미지 경로로 수정 필요
    e.target.alt = "이미지를 불러올 수 없습니다";
  };

  // item이 없는 경우 예외 처리
  if (!item) {
    return null;
  }

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          color: "black",
          padding: "30px",
          borderRadius: "8px",
          zIndex: 10000,
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              margin: 0,
              fontWeight: "bold",
              wordBreak: "break-word",
              flex: 1,
              paddingRight: "20px",
            }}
          >
            {item.ccbaMnm1}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#121a35",
              color: "white",
              padding: "3px 15px",
              border: "none",
              fontSize: "25px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>

        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.ccbaMnm1}
            onError={handleImageError}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "20px",
              maxHeight: "350px",
              objectFit: "cover",
            }}
          />
        )}

        <p
          style={{
            fontSize: "18px",
            marginBottom: "20px",
            boxSizing: "border-box",
            border: "1px solid #7d7576",
            borderRadius: "8px",
            padding: "10px",
            lineHeight: "1.6",
          }}
        >
          {item.content}
        </p>

        <div
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p>
            <strong>위치:</strong> {item.ccbaLcad}
          </p>
          <p>
            <strong>시대:</strong> {item.ccceName}
          </p>
          {item.ccmaName && (
            <p>
              <strong>문화재 종류:</strong> {item.ccmaName}
            </p>
          )}
          {item.ccbaQuan && (
            <p>
              <strong>수량:</strong> {item.ccbaQuan}
            </p>
          )}
          {item.ccbaAsNo && (
            <p>
              <strong>지정번호:</strong> {item.ccbaAsNo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
