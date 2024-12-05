import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import default_Img from "../assets/festival.png";
import PageModal from "./PageModal";

const FavoriteList = () => {
  const dispatch = useDispatch();
  const { heritages, festivals } = useSelector((state) => state.favorites);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [heritagePage, setHeritagePage] = useState(0);
  const [festivalPage, setFestivalPage] = useState(0);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getItemsPerPage = () => {
    if (windowWidth <= 640) return 1; // 모바일
    if (windowWidth <= 960) return 2; // 태블릿
    if (windowWidth <= 1280) return 3; // 작은 데스크톱
    return 4; // 큰 데스크톱
  };

  const itemsPerPage = getItemsPerPage();

  useEffect(() => {
    setHeritagePage(0);
    setFestivalPage(0);
  }, [itemsPerPage]);

  const handleRemoveFavorite = (item, type) => {
    try {
      dispatch(
        removeFavorite({
          type: type === "heritage" ? "heritage" : "event", // "festival"을 "event"로 변경
          id: type === "heritage" ? item.ccbaMnm1 : item.id,
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

  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 pb-2 pt-12">
      <h1 className="text-2xl font-semibold mb-10 -mt-6">나의 즐겨찾기</h1>

      {/* 문화재 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          ◎ 문화재 ({heritages.length})
        </h2>

        <div className="relative px-8">
          {heritages.length > itemsPerPage && (
            <>
              <button
                onClick={() => handlePageChange(-1, "heritage")}
                className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200"
                disabled={heritagePage === 0}
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() => handlePageChange(1, "heritage")}
                className="absolute right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 "
                disabled={
                  heritagePage >= Math.ceil(heritages.length / itemsPerPage) - 1
                }
              >
                <IoIosArrowForward size={24} />
              </button>
            </>
          )}

          <div className="flex justify-center gap-6 overflow-hidden">
            <div className="flex gap-6 transition-transform duration-300 ease-in-out">
              {getCurrentItems(heritages, heritagePage).map((heritage) => (
                <div
                  key={heritage.ccbaKdcd}
                  className="bg-white p-4 rounded-lg shadow-xl flex-1 min-w-[250px] max-w-[300px] max-h-[400px] cursor-pointer border border-gray-200"
                  onClick={() => openModal(heritage, "heritage")}
                >
                  <div className="flex flex-col h-full">
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                      <img
                        src={heritage.imageUrl}
                        alt={heritage.ccbaMnm1}
                        className="w-full h-[160px] object-cover"
                        onError={onErrorImg}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(heritage, "heritage");
                        }}
                        className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-20"
                        aria-label="즐겨찾기 해제"
                      >
                        <AiFillStar className="text-2xl filter drop-shadow-md" />
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 행사 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          ◎ 행사 ({festivals.length})
        </h2>

        <div className="relative px-8">
          {festivals.length > itemsPerPage && (
            <>
              <button
                onClick={() => handlePageChange(-1, "festival")}
                className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200"
                disabled={festivalPage === 0}
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() => handlePageChange(1, "festival")}
                className="absolute right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200"
                disabled={
                  festivalPage >= Math.ceil(festivals.length / itemsPerPage) - 1
                }
              >
                <IoIosArrowForward size={24} />
              </button>
            </>
          )}

          <div className="flex justify-center gap-6 overflow-hidden">
            <div className="flex gap-6 transition-transform duration-300 ease-in-out">
              {getCurrentItems(festivals, festivalPage).map((festival) => (
                <div
                  key={festival.programName}
                  className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px] max-h-[400px] cursor-pointer"
                  onClick={() => openModal(festival, "festival")}
                >
                  <div className="flex flex-col h-full">
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                      <img
                        src={festival.imageUrl || default_Img}
                        alt={festival.programName}
                        className="w-full h-[160px] object-cover"
                        onError={onErrorImg}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(festival, "festival");
                        }}
                        className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500 transition-colors z-20"
                        aria-label="즐겨찾기 해제"
                      >
                        <AiFillStar className="text-2xl filter drop-shadow-md" />
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {heritages.length === 0 && festivals.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          즐겨찾기한 항목이 없습니다.
        </div>
      )}

      <PageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        type={modalType}
      />
    </div>
  );
};

export default FavoriteList;
