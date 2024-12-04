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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-10">나의 즐겨찾기</h1>

      {/* 문화재 섹션 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">
          문화재 ({heritages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heritages.map((heritage) => (
            <div
              key={heritage.ccbaKdcd}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={heritage.imageUrl}
                  alt={heritage.ccbaMnm1}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {heritage.ccbaMnm1}
                  </h3>
                  <p className="text-gray-600 text-sm">{heritage.ccbaLcad}</p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(heritage, "heritage")}
                  className="text-yellow-400 hover:text-yellow-500 transition-colors"
                  aria-label="즐겨찾기 해제"
                >
                  <AiFillStar className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {heritages.length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            즐겨찾기한 문화재가 없습니다.
          </div>
        )}
      </div>

      {/* 행사 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">
          행사 ({festivals.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((festival) => (
            <div
              key={festival.programName}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {festival.imageUrl ? (
                  <img
                    src={festival.imageUrl}
                    onError={onErrorImg}
                    alt=""
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <img
                    src={default_Img}
                    alt=""
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {festival.programName}
                  </h3>
                  <p className="text-gray-600 text-sm">{festival.location}</p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(festival, "event")}
                  className="text-yellow-400 hover:text-yellow-500 transition-colors"
                  aria-label="즐겨찾기 해제"
                >
                  <AiFillStar className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {festivals.length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            즐겨찾기한 행사가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;
