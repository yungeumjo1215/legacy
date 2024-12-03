import React from "react";

const DetailSection = ({ item }) => {
  if (!item) return null; // 선택된 항목이 없으면 아무것도 표시하지 않음

  return (
    <div className="bg-white text-black p-6 rounded-lg w-full mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">{item.ccbaMnm1}</h2>
      </div>
      <img
        src={item.imageUrl}
        alt={item.ccbaMnm1}
        className="w-full rounded-md mb-4 max-h-[350px] object-cover"
      />
      <p className="font-size: 18px; margin-bottom: 20px; box-sizing: border-box; border: 1px solid #7d7576; border-radius: 8px; padding: 10px;">
        {item.content}
      </p>
      <p className="font-size: 16px; margin-bottom: 20px;">
        <strong>위치:</strong> {item.ccbaLcad}
      </p>
      <p className="font-size: 16px; margin-bottom: 20px;">
        <strong>시대:</strong> {item.ccceName}
      </p>
    </div>
  );
};

export default DetailSection;
