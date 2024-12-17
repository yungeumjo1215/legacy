import React from "react";
import { useDispatch } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import default_Img from "../assets/festival.png";
import axios from "axios";

const PageModal = ({ isOpen, onClose, item, type }) => {
  const dispatch = useDispatch();

  if (!isOpen || !item) return null;

  const handleRemoveFavorite = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        id: type === "heritage" ? item.heritageid : item.festivalid || item.id,
        type: type === "heritage" ? "heritage" : "event",
      };

      await axios.delete(`http://localhost:8000/pgdb/favoritelist`, {
        data: requestData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      dispatch(
        removeFavorite({
          type: type === "heritage" ? "heritage" : "festival",
          id: type === "heritage" ? item.ccbamnm1 : item.festivalid || item.id,
        })
      );
      onClose();
    } catch (error) {
      console.error("즐겨찾기 제거 중 오류 발생:", error);
    }
  };

  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {type === "heritage" ? item.ccbamnm1 : item.programName}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleRemoveFavorite}
              className="text-yellow-400 hover:text-yellow-500"
              aria-label="즐겨찾기 해제"
            >
              <AiFillStar className="text-2xl" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 이미지 */}
        <div className="p-4 border-b">
          <img
            src={
              type === "heritage" ? item.imageurl : item.imageUrl || default_Img
            }
            alt={type === "heritage" ? item.ccbamnm1 : item.programName}
            className="w-full h-[300px] object-contain bg-gray-100 rounded-lg"
            onError={onErrorImg}
          />
        </div>

        {/* 상세 정보 */}
        <div className="p-4 space-y-4">
          {type === "heritage" ? (
            <>
              <div>
                <span className="font-semibold text-gray-700">시대</span>
                <p className="mt-1 text-gray-600">{item.cccename}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">위치</span>
                <p className="mt-1 text-gray-600">{item.ccbalcad}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-semibold text-gray-700">장소</span>
                <p className="mt-1 text-gray-600">{item.location}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">기간</span>
                <p className="mt-1 text-gray-600">
                  {item.startDate} ~ {item.endDate}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">문의</span>
                <p className="mt-1 text-gray-600">{item.contact}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageModal;
