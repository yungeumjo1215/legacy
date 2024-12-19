import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import default_Img from "../../assets/festival.png";
import { useNavigate } from "react-router-dom";
import {
  addFavorites,
  deleteFavorites,
  addFavorite,
  removeFavorite,
} from "../../redux/slices/favoriteSlice";

const EventModal = ({ event, onClose, hideStarButton }) => {
  const dispatch = useDispatch();
  const { festivals } = useSelector((state) => state.favorites);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [alertMessage, setAlertMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  useEffect(() => {
    const favoriteStatus =
      Array.isArray(festivals) &&
      festivals.some((festival) => festival.festivalid === event?.festivalid);

    setIsFavorite(favoriteStatus);
  }, [festivals, event?.festivalid]);

  useEffect(() => {
    const recentItems = JSON.parse(localStorage.getItem("recentItems")) || [];

    const newItem = {
      id: `event-${event.programName}`, // 고유 ID 생성
      type: "event",
      title: event.programName,
      imageUrl: event.image,
      begin_de: event.startDate,
      location: event.location,
      content: event.programContent,
    };

    // 동일한 ID를 가진 항목이 있는지 확인하고 필터링
    const filteredItems = recentItems.filter((item) => item.id !== newItem.id);

    // 새 항목을 배열 앞에 추가하고 최대 5개까지만 유지
    const updatedItems = [newItem, ...filteredItems].slice(0, 5);

    localStorage.setItem("recentItems", JSON.stringify(updatedItems));
  }, [event]);

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      setAlertMessage(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!isFavorite) {
        // 즐겨찾기 추가
        await dispatch(
          addFavorites({
            token,
            favoriteId: event.festivalid,
            type: "event",
          })
        ).unwrap();

        // 로컬 상태 업데이트
        dispatch(
          addFavorite({
            type: "festival",
            data: {
              festivalid: event.festivalid,
              id: event.festivalid,
              programName: event.programName,
              programContent: event.programContent,
              location: event.location,
              startDate: event.startDate,
              endDate: event.endDate,
              targetAudience: event.targetAudience,
              contact: event.contact,
              image: event.image,
            },
          })
        );
        setAlertMessage("즐겨찾기에 추가되었습니다.");
      } else {
        // 즐겨찾기 제거
        await dispatch(
          deleteFavorites({
            token,
            favoriteId: event.festivalid,
            type: "event",
          })
        ).unwrap();

        // 로컬 상태 업데이트
        dispatch(
          removeFavorite({
            type: "festival",
            id: event.festivalid,
          })
        );
        setAlertMessage("즐겨찾기가 해제되었습니다.");
      }
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류 발생:", error);
      setAlertMessage("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    closeAlert();
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-lg shadow-xl z-50 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div className="flex justify-between items-center mb-[8px]">
            <h2 className="MainFont text-2xl">{event.programName}</h2>
            <div className="flex items-center gap-4">
              {!hideStarButton && (
                <button
                  onClick={handleFavoriteClick}
                  className="text-2xl text-yellow-500 hover:text-yellow-600"
                >
                  {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-blue-800 text-white px-4 py-1 border-none text-[20px] rounded cursor-pointer"
              >
                X
              </button>
            </div>
          </div>
          <div className="SubFont text-2xl space-y-3">
            <div className="border border-gray-700 w-full p-4 rounded-md text-gray-950 whitespace-pre-line overflow-hidden text-[20px]">
              <p>{event.programContent}</p>
            </div>

            <div className="SubFont grid grid-cols-2 gap-4 text-lg">
              <div>
                <p>기간</p>
                <p>
                  {event.startDate} ~ {event.endDate}
                </p>
              </div>
              <div>
                <p>장소</p>
                <p>{event.location}</p>
              </div>
              <div>
                <p>대상</p>
                <p>{event.targetAudience}</p>
              </div>
              <div>
                <p>문의</p>
                <p>{event.contact}</p>
              </div>
              <img
                src={
                  event.image && event.image !== "N/A"
                    ? event.image
                    : default_Img
                }
                alt={event.programName}
                className="w-0 h-auto opacity-0"
                loading="lazy"
                onError={onErrorImg}
              />
            </div>
          </div>
        </div>
      </div>

      {alertMessage && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={closeAlert}
        >
          <div
            className="bg-[#e2e2e2] rounded-lg p-6 max-w-sm w-full mx-4 h-[180px] md:h-[200px] flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-lg mb-4 whitespace-pre-wrap">
              {alertMessage}
            </p>
            <div className="flex gap-2 mt-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={closeAlert}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    닫기
                  </button>
                </>
              ) : (
                <button
                  onClick={closeAlert}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  확인
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
