import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import default_Img from "../assets/eventIamge.png";

const FavoriteList = () => {
  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  const dispatch = useDispatch();
  const { heritages, festivals } = useSelector((state) => state.favorites);

  const handleRemoveFavorite = (item, type) => {
    try {
      dispatch(
        removeFavorite({
          type,
          id: type === "heritage" ? item.ccbaMnm1 : item.programName,
        })
      );
    } catch (error) {
      console.error("즐겨찾기 제거 중 오류 발생:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-10 -mt-6">나의 즐겨찾기</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          문화재 ({heritages.length})
        </h2>

        <div className="flex gap-4">
          {heritages.map((heritage) => (
            <div
              key={heritage.ccbaKdcd}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex-1 items-center justify-center">
                <div className="flex justify-center items-center size-24">
                  <img src={heritage.imageUrl} alt={heritage.ccbaMnm1} />
                </div>
                <h3 className="text-lg font-semibold">{heritage.ccbaMnm1}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {heritage.ccbaLcad}
                </p>
              </div>
              <button
                onClick={() => handleRemoveFavorite(heritage, "heritage")}
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                aria-label="즐겨찾기 해제"
              >
                <AiFillStar className="text-2xl" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {heritages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          즐겨찾기한 항목이 없습니다.
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          행사 ({festivals.length})
        </h2>
        <div className="flex gap-4">
          {festivals.map((festival) => (
            <div
              key={festival.programName}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex-1 items-center justify-center">
                <div className="flex justify-center items-center size-24">
                  <img src={festival.imageUrl} onError={onErrorImg} alt="" />
                </div>
                <h3 className="text-lg font-semibold">
                  {festival.programName}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {festival.location}
                </p>
              </div>
              <button
                onClick={() => handleRemoveFavorite(festival, "event")}
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                aria-label="즐겨찾기 해제"
              >
                <AiFillStar className="text-2xl" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {festivals.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          즐겨찾기한 항목이 없습니다.
        </div>
      )}
    </div>
  );
};
export default FavoriteList;
