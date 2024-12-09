import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Modal = ({ item, onClose, onFavoriteChange }) => {
  const dispatch = useDispatch();
  const { heritages } = useSelector((state) => state.favorites);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoriteStatus = heritages.some(
      (heritage) => heritage.ccbamnm1 === item.ccbamnm1
    );
    setIsFavorite(favoriteStatus);
  }, [heritages, item.ccbamnm1]);

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      setAlertMessage(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      return;
    }

    try {
      if (isFavorite) {
        dispatch(
          removeFavorite({
            type: "heritage",
            id: item.ccbamnm1,
          })
        );
      } else {
        dispatch(
          addFavorite({
            type: "heritage",
            id: item.ccbamnm1,
            ccbamnm1: item.ccbamnm1,
            ccbalcad: item.ccbalcad,
            content: item.content,
            imageurl: item.imageurl,
            ccbakdcd: item.ccbakdcd,
            cccename: item.cccename,
          })
        );
      }

      setAlertMessage(
        isFavorite ? "즐겨찾기가 해제되었습니다." : "즐겨찾기에 추가되었습니다."
      );

      if (onFavoriteChange) {
        onFavoriteChange(item.ccbakdcd, !isFavorite);
      }
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류 발생:", error);
      setAlertMessage("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
  };

  const handleLoginClick = () => {
    navigate("/login");
    closeAlert();
  };

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
          <h2 className="text-[28px] m-0 MainFont break-words flex-1 pr-5">
            {item.ccbamnm1}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFavoriteClick}
              className="text-2xl text-yellow-500 hover:text-yellow-600"
            >
              {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
            </button>
            <button
              onClick={onClose}
              className="bg-blue-800 text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
            >
              X
            </button>
          </div>
        </div>

        {item.imageurl && (
          <img
            src={item.imageurl}
            alt={item.ccbamnm1}
            onError={handleImageError}
            className="w-full rounded-lg mb-5 max-h-[350px] object-cover"
          />
        )}

        <p className="SubFont text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed">
          {item.content}
        </p>

        <div className="SubFont text-base mb-2.5 flex flex-col gap-2.5">
          <p>
            <strong className="MainFont">위치:</strong> {item.ccbalcad}
          </p>
          <p>
            <strong className="MainFont">시대:</strong> {item.cccename}
          </p>
        </div>

        {alertMessage && (
          <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center">
            <div
              className="bg-[#e2e2e2] text-black p-4 md:p-5 rounded-lg 
                           w-[90%] md:w-[400px] max-w-[400px]
                           h-[180px] md:h-[200px] 
                           flex flex-col justify-center items-center text-center"
            >
              <p className="font-bold text-base md:text-lg whitespace-pre-wrap mt-4 md:mt-5">
                {alertMessage}
              </p>
              <div className="mt-4 md:mt-6 flex gap-2 md:gap-2.5">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                               cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      로그인하기
                    </button>
                    <button
                      onClick={closeAlert}
                      className="bg-gray-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                               cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      닫기
                    </button>
                  </>
                ) : (
                  <button
                    onClick={closeAlert}
                    className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base
                             cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    확인
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
