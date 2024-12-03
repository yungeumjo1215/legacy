import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Modal = ({ item, onClose, onFavoriteChange }) => {
  const dispatch = useDispatch();
  const { heritages } = useSelector((state) => state.favorites);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [alertMessage, setAlertMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoriteStatus = heritages.some(
      (heritage) => heritage.ccbaMnm1 === item.ccbaMnm1
    );
    setIsFavorite(favoriteStatus);
  }, [heritages, item.ccbaMnm1]);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      setAlertMessage("로그인이 필요한 서비스입니다.");
      return;
    }

    if (isFavorite) {
      dispatch(
        removeFavorite({
          type: "heritage",
          id: item.ccbaMnm1,
        })
      );
      setAlertMessage("즐겨찾기가 해제되었습니다.");
      if (onFavoriteChange) {
        onFavoriteChange(item.ccbaKdcd, false);
      }
    } else {
      dispatch(
        addFavorite({
          type: "heritage",
          id: item.ccbaMnm1,
          ccbaMnm1: item.ccbaMnm1,
          ccbaLcad: item.ccbaLcad,
          content: item.content,
          imageUrl: item.imageUrl,
          ccbaKdcd: item.ccbaKdcd,
          ccceName: item.ccceName,
        })
      );
      setAlertMessage("즐겨찾기에 추가되었습니다.");
      if (onFavoriteChange) {
        onFavoriteChange(item.ccbaKdcd, true);
      }
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
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
            {item.ccbaMnm1}
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
              className="bg-[#121a35] text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
            >
              X
            </button>
          </div>
        </div>

        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.ccbaMnm1}
            onError={handleImageError}
            className="w-full rounded-lg mb-5 max-h-[350px] object-cover"
          />
        )}

        <p className="SubFont text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed">
          {item.content}
        </p>

        <div className="SubFont text-base mb-2.5 flex flex-col gap-2.5">
          <p>
            <strong className="MainFont">위치:</strong> {item.ccbaLcad}
          </p>
          <p>
            <strong className="MainFont">시대:</strong> {item.ccceName}
          </p>
        </div>

        {alertMessage && (
          <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <p className="text-center text-lg mb-4">{alertMessage}</p>
              <div className="flex justify-center">
                <button
                  onClick={closeAlert}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
