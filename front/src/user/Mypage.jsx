import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TiStarFullOutline } from "react-icons/ti";
import { toast } from "react-toastify";

const Mypage = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // localStorage에서 즐겨찾기 목록 가져오기
    const savedFavorites = localStorage.getItem("selectedFestivals");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 즐겨찾기 해제 핸들러
  const handleRemoveFavorite = (eventName) => {
    const updatedFavorites = favorites.filter((item) => item !== eventName);
    setFavorites(updatedFavorites);
    localStorage.setItem("selectedFestivals", JSON.stringify(updatedFavorites));
    toast.success("즐겨찾기가 해제되었습니다.");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">로그인이 필요한 서비스입니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">즐겨찾기한 행사</h2>
        {favorites.length > 0 ? (
          <ul className="space-y-4">
            {favorites.map((eventName, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <span className="text-lg">{eventName}</span>
                <button
                  onClick={() => handleRemoveFavorite(eventName)}
                  className="flex items-center text-yellow-500 hover:text-yellow-600"
                >
                  <TiStarFullOutline className="text-2xl" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            즐겨찾기한 행사가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default Mypage;
