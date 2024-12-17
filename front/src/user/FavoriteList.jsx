import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import default_Img from "../assets/festival.png";
import PageModal from "./PageModal";
import axios from "axios";

const FavoriteList = () => {
  const [favorites, setFavorites] = useState({ heritages: [], festivals: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heritagePage, setHeritagePage] = useState(0);
  const [festivalPage, setFestivalPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [refresh, setRefresh] = useState(false);

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/pgdb/favoritelist",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites({
          heritages: response.data.heritages || [],
          festivals: response.data.festivals || [],
        });
      } catch (error) {
        console.error("Failed to fetch favorites:", error.response || error);
      }
    };
    fetchFavorites();
  }, [refresh]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getItemsPerPage = () => {
    if (windowWidth <= 640) return 1;
    if (windowWidth <= 960) return 2;
    if (windowWidth <= 1280) return 3;
    return 4;
  };

  const itemsPerPage = getItemsPerPage();

  const handleRemoveFavorite = async (item, type) => {
    try {
      const token = localStorage.getItem("token");

      // Prepare the DELETE request parameters
      const requestData = {
        id: type === "heritage" ? item.heritageid : item.festivalid,
        type: type === "heritage" ? "heritage" : "event",
      };

      console.log("Deleting favorite with data:", requestData);

      // Send DELETE request with params
      await axios.delete("http://localhost:8000/pgdb/favoritelist", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: requestData.id, type: requestData.type }, // Send data in the body
      });

      console.log("Favorite removed successfully:", item);

      // Update state after successful deletion
      setFavorites((prev) => ({
        ...prev,
        [type === "heritage" ? "heritages" : "festivals"]: prev[
          type === "heritage" ? "heritages" : "festivals"
        ].filter((i) =>
          type === "heritage"
            ? i.heritageid !== item.heritageid
            : i.festivalid !== item.festivalid
        ),
      }));
    } catch (error) {
      console.error("Error removing favorite:", error.response || error);
    }
  };

  const handlePageChange = (direction, type) => {
    if (type === "heritage") {
      const maxPage = Math.ceil(favorites.heritages.length / itemsPerPage) - 1;
      const newPage = heritagePage + direction;
      if (newPage >= 0 && newPage <= maxPage) setHeritagePage(newPage);
    } else {
      const maxPage = Math.ceil(favorites.festivals.length / itemsPerPage) - 1;
      const newPage = festivalPage + direction;
      if (newPage >= 0 && newPage <= maxPage) setFestivalPage(newPage);
    }
  };

  const getCurrentItems = (items, page) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  const { heritages, festivals } = favorites;

  const handleUpdate = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="p-4 pb-12 pt-12">
      <h1 className="text-2xl font-semibold mb-10 -mt-6">나의 즐겨찾기</h1>

      {/* 문화재 섹션 */}
      <Section
        title="문화재"
        data={heritages}
        page={heritagePage}
        onPageChange={handlePageChange}
        type="heritage"
        onOpenModal={openModal}
        onRemove={handleRemoveFavorite}
        getCurrentItems={getCurrentItems}
        onErrorImg={onErrorImg}
      />

      {/* 행사 섹션 */}
      <Section
        title="행사"
        data={festivals}
        page={festivalPage}
        onPageChange={handlePageChange}
        type="festival"
        onOpenModal={openModal}
        onRemove={handleRemoveFavorite}
        getCurrentItems={getCurrentItems}
        onErrorImg={onErrorImg}
      />

      <PageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        type={modalType}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

const Section = ({
  title,
  data,
  page,
  onPageChange,
  type,
  onOpenModal,
  onRemove,
  getCurrentItems,
  onErrorImg,
}) => {
  const itemsPerPage = 4;
  const maxPage = Math.ceil(data.length / itemsPerPage) - 1;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {title} ({data.length})
      </h2>
      <div className="relative px-8 h-[265px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-gray-500">
              즐겨찾기한 항목이 없습니다.
            </p>
          </div>
        ) : (
          <>
            {data.length > itemsPerPage && (
              <>
                <button
                  onClick={() => onPageChange(-1, type)}
                  disabled={page === 0}
                  className="absolute left-10 top-1/2 -translate-y-1/2 z-10"
                >
                  <IoIosArrowBack size={24} />
                </button>
                <button
                  onClick={() => onPageChange(1, type)}
                  disabled={page >= maxPage}
                  className="absolute right-10 top-1/2 -translate-y-1/2 z-10"
                >
                  <IoIosArrowForward size={24} />
                </button>
              </>
            )}
            <div className="flex gap-6 justify-center h-full items-center">
              {getCurrentItems(data, page).map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-4 bg-white rounded shadow cursor-pointer w-[250px]"
                  onClick={() => onOpenModal(item, type)}
                >
                  <img
                    src={
                      type === "heritage"
                        ? item.heritageimageurl || default_Img
                        : item.festivalimageurl || default_Img
                    }
                    alt={
                      type === "heritage"
                        ? item.heritagename
                        : item.festivalname
                    }
                    onError={onErrorImg}
                    className="h-[180px] w-[220px] object-cover rounded"
                  />
                  <h3 className="mt-2 font-semibold truncate">
                    {type === "heritage"
                      ? item.heritagename
                      : item.festivalname}
                  </h3>
                  {/* AiFillStar for favorite removal */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item, type);
                    }}
                    className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-500"
                  >
                    <AiFillStar className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;
