import React from "react";
import { useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
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
        id: type === "heritage" ? item.heritageid : item.festivalid,
        type: type === "heritage" ? "heritage" : "festival",
      };

      await axios.delete(`http://localhost:8000/pgdb/favoritelist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: requestData,
      });

      dispatch(
        removeFavorite({
          type: type === "heritage" ? "heritage" : "festival",
          id: type === "heritage" ? item.heritageid : item.festivalid,
        })
      );
      onClose();
    } catch (error) {
      console.error("즐겨찾기 제거 중 오류 발생:", error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = default_Img;
    e.target.alt = "이미지를 불러올 수 없습니다";
  };

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
          <h2 className="text-[28px] m-0 MainFont break-words flex-1 pr-5">
            {type === "heritage" ? item.heritagename : item.festivalname}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRemoveFavorite}
              className="text-2xl text-yellow-500 hover:text-yellow-600"
            >
              <AiFillStar />
            </button>
            <button
              onClick={onClose}
              className="bg-blue-800 text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
            >
              X
            </button>
          </div>
        </div>

        <img
          src={
            type === "heritage"
              ? item.heritageimageurl || default_Img
              : item.festivalimageurl || default_Img
          }
          alt={type === "heritage" ? item.heritagename : item.festivalname}
          onError={handleImageError}
          className="w-full rounded-lg mb-5 max-h-[350px] object-contain"
        />

        <p className="SubFont text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed whitespace-pre-line">
          {type === "heritage" ? item.heritagecontent : item.festivalcontent}
        </p>

        <div className="SubFont text-base mb-2.5 flex flex-col gap-2.5">
          {type === "heritage" ? (
            <>
              <p>
                <strong className="MainFont">시대:</strong>{" "}
                {item.heritagecccename}
              </p>
              <p>
                <strong className="MainFont">위치:</strong>{" "}
                {item.heritageccbalcad}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong className="MainFont">장소:</strong>{" "}
                {item.festivalccbalcad}
              </p>
              <p>
                <strong className="MainFont">기간:</strong>{" "}
                {item.festivalstartdate} ~ {item.festivalenddate}
              </p>
              <p>
                <strong className="MainFont">문의:</strong>{" "}
                {item.festivalcontact}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageModal;
