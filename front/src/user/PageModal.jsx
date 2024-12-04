import React from "react";
import default_Img from "../assets/eventIamge.png";

const PageModal = ({ isOpen, onClose, item, type }) => {
  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {type === "heritage" ? item.ccbaMnm1 : item.programName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {type === "event" && (
            <div className="w-full md:w-1/2">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  onError={onErrorImg}
                  alt=""
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={default_Img}
                  onError={onErrorImg}
                  alt=""
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
          )}

          <div className="w-full md:w-1/2">
            {type === "heritage" ? (
              // 문화재 정보
              <>
                <p className="mb-2">
                  <span className="font-semibold">위치:</span> {item.ccbaLcad}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">시대:</span> {item.ccceName}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">종목:</span> {item.ccmaName}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">지정번호:</span>{" "}
                  {item.ccbaKdcd}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">관리자:</span>{" "}
                  {item.ccbaAdmin}
                </p>
              </>
            ) : (
              // 행사 정보
              <>
                <p className="mb-2">
                  <span className="font-semibold">장소:</span> {item.location}
                </p>
                <p className="mb-2 text-base">
                  <span className="font-semibold ">기간:</span> {item.startDate}
                  ~{item.endDate}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">요금:</span>{" "}
                  {item.fee || "무료"}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">주최:</span> {item.sponsor}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">문의:</span> {item.phone}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageModal;
