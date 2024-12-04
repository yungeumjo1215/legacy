import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const FavoriteList = () => {
  const dispatch = useDispatch();
  const { heritages, festivals } = useSelector((state) => state.favorites);

  const [heritagePage, setHeritagePage] = useState(0);
  const [festivalPage, setFestivalPage] = useState(0);

  const itemsPerPage = 4;

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

  const handlePageChange = (direction, type) => {
    if (type === "heritage") {
      const maxPage = Math.ceil(heritages.length / itemsPerPage) - 1;
      const newPage = heritagePage + direction;
      if (newPage >= 0 && newPage <= maxPage) {
        setHeritagePage(newPage);
      }
    } else {
      const maxPage = Math.ceil(festivals.length / itemsPerPage) - 1;
      const newPage = festivalPage + direction;
      if (newPage >= 0 && newPage <= maxPage) {
        setFestivalPage(newPage);
      }
    }
  };

  const getCurrentItems = (items, page) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-10 -mt-4">나의 즐겨찾기</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          문화재 ({heritages.length})
        </h2>

        <div className="relative">
          {heritages.length > itemsPerPage && (
            <>
              <button
                onClick={() => handlePageChange(-1, "heritage")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 ${
                  heritagePage === 0
                    ? "text-gray-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                disabled={heritagePage === 0}
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() => handlePageChange(1, "heritage")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 ${
                  heritagePage >= Math.ceil(heritages.length / itemsPerPage) - 1
                    ? "text-gray-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                disabled={
                  heritagePage >= Math.ceil(heritages.length / itemsPerPage) - 1
                }
              >
                <IoIosArrowForward size={24} />
              </button>
            </>
          )}

          <div className="flex gap-6 transition-all duration-300">
            {getCurrentItems(heritages, heritagePage).map((heritage) => (
              <div
                key={heritage.ccbaKdcd}
                className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px]"
              >
                <div className="flex flex-col h-full">
                  <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                    <img
                      src={heritage.imageUrl}
                      alt={heritage.ccbaMnm1}
                      className="w-full h-[160px] object-cover "
                    />
                    <button
                      onClick={() => handleRemoveFavorite(heritage, "heritage")}
                      className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-20"
                      aria-label="즐겨찾기 해제"
                    >
                      <AiFillStar className="text-2xl filter drop-shadow-md" />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-md font-semibold mb-2 line-clamp-2">
                      {heritage.ccbaMnm1}
                    </h3>
                    <p className="text-gray-600 text-xs mt-8 truncate">
                      {heritage.ccbaLcad}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 행사 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          행사 ({festivals.length})
        </h2>

        <div className="relative">
          {festivals.length > itemsPerPage && (
            <>
              <button
                onClick={() => handlePageChange(-1, "festival")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 ${
                  festivalPage === 0
                    ? "text-gray-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                disabled={festivalPage === 0}
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() => handlePageChange(1, "festival")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 ${
                  festivalPage >= Math.ceil(festivals.length / itemsPerPage) - 1
                    ? "text-gray-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                disabled={
                  festivalPage >= Math.ceil(festivals.length / itemsPerPage) - 1
                }
              >
                <IoIosArrowForward size={24} />
              </button>
            </>
          )}

          <div className="flex gap-6 transition-all duration-300">
            {getCurrentItems(festivals, festivalPage).map((festival) => (
              <div
                key={festival.programName}
                className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px]"
              >
                <div className="flex flex-col h-full">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg relative">
                    <img
                      src={festival.imageUrl || "/default-festival.jpg"}
                      alt={festival.programName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(festival, "festival")}
                      className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-20"
                      aria-label="즐겨찾기 해제"
                    >
                      <AiFillStar className="text-2xl filter drop-shadow-md" />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                      {festival.programName}
                    </h3>
                    <p className="text-gray-600 text-xs mt-auto truncate">
                      {festival.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {heritages.length === 0 && festivals.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          즐겨찾기한 항목이 없습니다.
        </div>
      )}
    </div>
  );
};

export default FavoriteList;
