import React from "react";

const Modal = ({ item, onClose }) => {
  const handleImageError = (e) => {
    e.target.src = "/default-image.jpg";
    e.target.alt = "이미지를 불러올 수 없습니다";
  };

  if (!item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 z-[9999] flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-black p-8 rounded-lg z-[10000] w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[28px] m-0 font-bold break-words flex-1 pr-5">
            {item.ccbaMnm1}
          </h2>
          <button
            onClick={onClose}
            className="bg-[#121a35] text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
          >
            X
          </button>
        </div>

        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.ccbaMnm1}
            onError={handleImageError}
            className="w-full rounded-lg mb-5 max-h-[350px] object-cover"
          />
        )}

        <p className="text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed">
          {item.content}
        </p>

        <div className="text-base mb-2.5 flex flex-col gap-2.5">
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
