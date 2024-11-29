import React from "react";

const DetailSection = ({ item }) => {
  if (!item) return null; // 선택된 항목이 없으면 아무것도 표시하지 않음

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "black",
        padding: "30px",
        borderRadius: "8px",
        width: "100%",
        marginTop: "20px", // 사이드바와의 간격
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            margin: 0,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {item.ccbaMnm1}
        </h2>
      </div>
      <img
        src={item.imageUrl}
        alt={item.ccbaMnm1}
        style={{
          width: "100%",
          borderRadius: "8px",
          marginBottom: "20px",
          maxHeight: "350px",
          objectFit: "cover",
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
        {item.content}
      </p>
      <p
        style={{
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <strong>위치:</strong> {item.ccbaLcad}
      </p>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        <strong>시대:</strong> {item.ccceName}
      </p>
    </div>
  );
};

export default DetailSection;
