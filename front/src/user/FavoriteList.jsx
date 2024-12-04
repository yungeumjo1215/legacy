import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import default_Img from "../assets/festival.png";

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

      {/* 문화재 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 ">
          문화재 ({heritages.length})
        </h2>

        <div className="flex gap-4">
          {heritages.map((heritage) => (
            <div
              key={heritage.ccbaKdcd}
              className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px] max-h-[400px] flex flex-col"
            >
              <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                <img
                  src={heritage.imageUrl}
                  alt={heritage.ccbaMnm1}
                  className="w-full h-full object-cover"
                  onError={onErrorImg}
                />
                <button
                  onClick={() => handleRemoveFavorite(heritage, "heritage")}
                  className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-10"
                  aria-label="즐겨찾기 해제"
                >
                  <AiFillStar className="text-3xl drop-shadow-lg" />
                </button>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-md font-semibold mb-2 line-clamp-2 min-h-[40px]">
                  {heritage.ccbaMnm1}
                </h3>
                <p className="mt-auto text-gray-600 text-xs truncate">
                  {heritage.ccbaLcad}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {heritages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          즐겨찾기한 항목이 없습니다.
        </div>
      )}

      {/* 행사 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          행사 ({festivals.length})
        </h2>

        <div className="flex gap-4">
          {festivals.map((festival) => (
            <div
              key={festival.programName}
              className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px] max-h-[400px] flex flex-col"
            >
              <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                <img
                  src={festival.imageUrl || default_Img}
                  alt={festival.programName}
                  className="w-full h-full object-cover"
                  onError={onErrorImg}
                />
                <button
                  onClick={() => handleRemoveFavorite(festival, "festival")}
                  className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-10"
                  aria-label="즐겨찾기 해제"
                >
                  <AiFillStar className="text-3xl drop-shadow-lg" />
                </button>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-md font-semibold mb-2 line-clamp-2 min-h-[40px]">
                  {festival.programName}
                </h3>
                <p className="mt-auto text-gray-600 text-xs truncate">
                  {festival.location}
                </p>
              </div>
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
