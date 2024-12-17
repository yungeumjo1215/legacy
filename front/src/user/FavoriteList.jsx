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

  // Fetch data on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token); // Debugging token
        const response = await axios.get(
          "http://localhost:8000/pgdb/favoritelist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Response Data:", response.data); // Debug the full response
        setFavorites({
          heritages: response.data.heritages || [],
          festivals: response.data.festivals || [],
        });
      } catch (error) {
        console.error("Failed to fetch favorites:", error.response || error);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    console.log("Favorites State Updated:", favorites); // Log the current state
  }, [favorites]);

  // Handle window resize
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
      const requestData = {
        id: type === "heritage" ? item.heritageid : item.festivalid,
        type: type === "heritage" ? "heritage" : "event",
      };
      console.log("Request Data for Deletion:", requestData); // Log deletion payload

      await axios.delete(
        `http://localhost:8000/pgdb/favoritelist?id=${requestData.id}&type=${requestData.type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Item removed successfully:", item);

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
  console.log("Heritages Data:", favorites.heritages);
  console.log("Festivals Data:", favorites.festivals);
  console.log("Current Page:", { heritagePage, festivalPage });
  console.log("Items Per Page:", itemsPerPage);

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
  const itemsPerPage = 4; // Customizable
  const maxPage = Math.ceil(data.length / itemsPerPage) - 1;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {title} ({data.length})
      </h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">즐겨찾기한 항목이 없습니다.</p>
      ) : (
        <div className="relative px-8">
          {data.length > itemsPerPage && (
            <>
              <button
                onClick={() => onPageChange(-1, type)}
                disabled={page === 0}
                className="absolute left-10 top-1/2 -translate-y-1/2 z-10">
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() => onPageChange(1, type)}
                disabled={page >= maxPage}
                className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
                <IoIosArrowForward size={24} />
              </button>
            </>
          )}
          <div className="flex gap-6 justify-center">
            {getCurrentItems(data, page).map((item, idx) => {
              console.log("Rendering Item:", item); // Debug each rendered item
              return (
                <div
                  key={idx}
                  className="relative p-4 bg-white rounded shadow cursor-pointer"
                  onClick={() => onOpenModal(item, type)}>
                  <img
                    src={item.imageurl || default_Img}
                    alt={
                      type === "heritage"
                        ? item.heritagename
                        : item.festivalname
                    }
                    onError={onErrorImg}
                    className="h-40 w-full object-cover rounded"
                  />
                  <h3 className="mt-2 font-semibold">
                    {type === "heritage"
                      ? item.heritagename
                      : item.festivalname}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteList;
