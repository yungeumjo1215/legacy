import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import default_Img from "../assets/festival.png";
import PageModal from "./PageModal";
import axios from "axios";

const FavoriteList = () => {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState({ heritages: [], festivals: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heritagePage, setHeritagePage] = useState(0);
  const [festivalPage, setFestivalPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/pgdb/favoritelist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites({
          heritages: response.data.heritages || [],
          festivals: response.data.festivals || [],
        });
      } catch (error) {
        console.error("즐겨찾기 목록 가져오기 실패:", error);
      }
    };

    fetchFavorites();
  }, []);

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
    if (windowWidth <= 640) return 1;
    if (windowWidth <= 960) return 2;
    if (windowWidth <= 1280) return 3;
    return 4;
  };

  const itemsPerPage = getItemsPerPage();

  useEffect(() => {
    setHeritagePage(0);
    setFestivalPage(0);
  }, [itemsPerPage]);

  const handleRemoveFavorite = async (item, type) => {
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        id: type === "heritage" ? item.heritageid : item.id,
        type: type === "heritage" ? "heritage" : "event",
      };

      await axios.delete(`http://localhost:8000/pgdb/favoritelist`, {
        data: requestData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setFavorites((prev) => ({
        ...prev,
        [type === "heritage" ? "heritages" : "festivals"]: prev[
          type === "heritage" ? "heritages" : "festivals"
        ].filter((i) =>
          type === "heritage"
            ? i.heritageid !== item.heritageid
            : i.id !== item.id
        ),
      }));

      dispatch(
        removeFavorite({
          type: type === "heritage" ? "heritage" : "event",
          id: type === "heritage" ? item.ccbamnm1 : item.id,
        })
      );
    } catch (error) {
      console.error("즐겨찾기 제거 중 오류 발생:", error);
    }
  };

  const handlePageChange = (direction, type) => {
    if (type === "heritage") {
      const maxPage = Math.ceil(favorites.heritages.length / itemsPerPage) - 1;
      const newPage = heritagePage + direction;
      if (newPage >= 0 && newPage <= maxPage) {
        setHeritagePage(newPage);
      }
    } else {
      const maxPage = Math.ceil(favorites.festivals.length / itemsPerPage) - 1;
      const newPage = festivalPage + direction;
      if (newPage >= 0 && newPage <= maxPage) {
        setFestivalPage(newPage);
      }
    }
  };

  const getCurrentItems = (items = [], page) => {
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

  const { heritages, festivals } = favorites;

  return (
    <div className="p-4 pb-12 pt-12">
      <h1 className="text-2xl font-semibold mb-10 -mt-6">나의 즐겨찾기</h1>

      {/* 문화재 섹션 */}
      <div className="mb-0">
        <h2 className="text-xl font-semibold mb-4">
          ◎ 문화재 ({Array.isArray(heritages) ? heritages.length : 0})
        </h2>
        <div className="-mb-24">
          {Array.isArray(heritages) && heritages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 mb-4 min-h-[300px] flex items-center justify-center">
              즐겨찾기한 문화재가 없습니다.
            </div>
          ) : (
            <div className="relative px-8 min-h-[400px]">
              {Array.isArray(heritages) && heritages.length > itemsPerPage && (
                <>
                  <button
                    onClick={() => handlePageChange(-1, "heritage")}
                    className="absolute left-10 top-[30%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200"
                    disabled={heritagePage === 0}
                  >
                    <IoIosArrowBack size={24} />
                  </button>
                  <button
                    onClick={() => handlePageChange(1, "heritage")}
                    className="absolute right-10 top-[30%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200"
                    disabled={
                      heritagePage >=
                      Math.ceil(heritages.length / itemsPerPage) - 1
                    }
                  >
                    <IoIosArrowForward size={24} />
                  </button>
                </>
              )}

              <div className="flex justify-center gap-6 overflow-hidden w-full">
                <div className="flex gap-6 transition-transform duration-300 justify-center ease-in-out w-full">
                  {getCurrentItems(heritages, heritagePage).map(
                    (heritage, idx) => (
                      <div
                        key={`${heritage.heritageid}-${idx}`}
                        className="bg-white p-4 rounded-lg shadow-xl flex-1 min-w-[250px] max-w-[300px] max-h-[400px] cursor-pointer border border-gray-200 transition-all duration-200 hover:z-20 relative z-10 opacity-0 animate-[slideRight_0.3s_ease-out_forwards] transform-gpu group"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                        onClick={() => openModal(heritage, "heritage")}
                      >
                        <div className="flex flex-col h-full">
                          <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                            <img
                              src={heritage.imageurl}
                              alt={heritage.ccbamnm1}
                              className="w-full h-[160px] object-cover transition-transform duration-200 group-hover:scale-[1.08]"
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
                              {heritage.ccbamnm1}
                            </h3>
                            <p className="mt-auto text-gray-600 text-xs truncate">
                              {heritage.ccbalcad}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 행사 섹션 */}
      <div className="mb-0">
        <h2 className="text-xl font-semibold mb-2">
          ◎ 행사 ({Array.isArray(festivals) ? festivals.length : 0})
        </h2>
        {Array.isArray(festivals) && festivals.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 min-h-[400px] flex items-center justify-center">
            즐겨찾기한 행사가 없습니다.
          </div>
        ) : (
          <div className="relative px-8">
            {Array.isArray(festivals) && festivals.length > itemsPerPage && (
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
                    festivalPage >=
                    Math.ceil(festivals.length / itemsPerPage) - 1
                  }
                >
                  <IoIosArrowForward size={24} />
                </button>
              </>
            )}

            <div className="flex justify-center gap-6 overflow-hidden w-full">
              <div className="flex gap-6 transition-transform duration-300 ease-in-out justify-center w-full">
                {getCurrentItems(festivals, festivalPage).map(
                  (festival, idx) => (
                    <div
                      key={`${festival.id}-${idx}`}
                      className="bg-white p-4 rounded-lg shadow-xl flex-1 min-w-[250px] max-w-[300px] max-h-[400px] cursor-pointer border border-gray-200 transition-all duration-200 hover:z-20 relative z-10 opacity-0 animate-[slideRight_0.3s_ease-out_forwards] transform-gpu group"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      onClick={() => openModal(festival, "festival")}
                    >
                      <div className="flex flex-col h-full">
                        <div className="w-full h-40 mb-4 overflow-hidden rounded-lg relative">
                          <img
                            className="w-full h-[160px] object-cover transition-transform duration-200 group-hover:scale-[1.08]"
                            src={festival.imageUrl || default_Img}
                            alt={festival.programName}
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
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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
