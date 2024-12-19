import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import default_Img from "../assets/festival.png";
import PageModal from "./PageModal";
import axios from "axios";

const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

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
      const requestData = {
        id: type === "heritage" ? item.heritageid : item.festivalid,
        type: type === "heritage" ? "heritage" : "event",
      };

      await axios.delete("http://localhost:8000/pgdb/favoritelist", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: requestData.id, type: requestData.type },
      });

      // 업데이트된 아이템 리스트 생성
      const updatedItems = favorites[
        type === "heritage" ? "heritages" : "festivals"
      ].filter((i) =>
        type === "heritage"
          ? i.heritageid !== item.heritageid
          : i.festivalid !== item.festivalid
      );

      // 페이지 상태 업데이트
      if (type === "heritage") {
        const maxPage = Math.ceil(updatedItems.length / getItemsPerPage());
        setHeritagePage((current) =>
          current >= maxPage ? maxPage - 1 : current
        );
      } else {
        const maxPage = Math.ceil(updatedItems.length / getItemsPerPage());
        setFestivalPage((current) =>
          current >= maxPage ? maxPage - 1 : current
        );
      }

      // 현재 페이지와 아이템 수를 기반으로 페이지 조정
      setFavorites((prev) => ({
        ...prev,
        [type === "heritage" ? "heritages" : "festivals"]: updatedItems,
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

  const handleUpdate = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/pgdb/favoritelist",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedData = {
        heritages: response.data.heritages || [],
        festivals: response.data.festivals || [],
      };

      // 페이지 상태 업데이트
      if (type === "heritage") {
        const maxPage = Math.ceil(
          updatedData.heritages.length / getItemsPerPage()
        );
        setHeritagePage((current) =>
          current >= maxPage ? maxPage - 1 : current
        );
      } else {
        const maxPage = Math.ceil(
          updatedData.festivals.length / getItemsPerPage()
        );
        setFestivalPage((current) =>
          current >= maxPage ? maxPage - 1 : current
        );
      }

      // favorites 상태 업데이트
      setFavorites(updatedData);
    } catch (error) {
      console.error("Failed to fetch favorites:", error.response || error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="p-4 pb-12 pt-12">
        <h1 className="text-2xl font-semibold mb-10 -mt-6">나의 즐겨찾기</h1>

        {/* 문화재 섹션 */}
        <Section
          title="◎ 문화재"
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
          title="◎ 행사"
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
    </>
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
                  className="absolute left-10 top-1/2 -translate-y-1/2 z-10 border rounded-full p-2 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                >
                  <IoIosArrowBack size={24} />
                </button>
                <button
                  onClick={() => onPageChange(1, type)}
                  disabled={page >= maxPage}
                  className="absolute right-10 top-1/2 -translate-y-1/2 z-10 border rounded-full p-2 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                >
                  <IoIosArrowForward size={24} />
                </button>
              </>
            )}
            <div className="flex gap-6 justify-center h-full items-center">
              {getCurrentItems(data, page).map((item, idx) => (
                <div
                  key={`${page}-${idx}`}
                  className="relative p-4 bg-white rounded-lg shadow cursor-pointer w-[280px] animate-slide-from-left border border-gray-200"
                  style={{
                    animationDelay: `${idx * 150}ms`,
                    opacity: 0,
                    animation: `slideIn 0.5s ease-out ${idx * 150}ms forwards`,
                  }}
                  onClick={() => onOpenModal(item, type)}
                >
                  <div className="relative overflow-hidden rounded">
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
                      className="h-[180px] w-[250px] object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item, type);
                      }}
                      className="absolute bottom-2 left-2 text-yellow-400 hover:text-yellow-500"
                    >
                      <AiFillStar className="text-2xl" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold truncate">
                      {type === "heritage"
                        ? item.heritagename
                        : item.festivalname}
                    </h3>
                    <p className="text-sm text-gray-600 mt-3 truncate">
                      {type === "heritage"
                        ? item.heritageaddress || "주소 정보 없음"
                        : item.festivallocation || "주소 정보 없음"}
                    </p>
                  </div>
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
