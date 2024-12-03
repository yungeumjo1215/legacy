import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoriteSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const EventModal = ({ event, onClose }) => {
  const dispatch = useDispatch();
  // festivals 상태 변화를 실시간으로 감지
  const { festivals } = useSelector((state) => state.favorites);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [alertMessage, setAlertMessage] = useState("");

  const isFavorite = festivals.some(
    (festival) => festival.programName === event.programName
  );
  // useEffect를 추가하여 상태 변화 모니터링
  useEffect(() => {
    console.log("즐겨찾기 상태 변경:", festivals);
  }, [festivals]);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      setAlertMessage("로그인이 필요한 서비스입니다.");
      return;
    }

    if (isFavorite) {
      dispatch(
        removeFavorite({
          programName: event.programName,
          type: "event",
        })
      );
      setAlertMessage("즐겨찾기가 해제되었습니다.");
    } else {
      dispatch(
        addFavorite({
          type: "event",
          programName: event.programName,
          programContent: event.programContent,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
          targetAudience: event.targetAudience,
          contact: event.contact,
        })
      );
      setAlertMessage("즐겨찾기에 추가되었습니다.");
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
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
              <button
                onClick={handleFavoriteClick}
                className="text-2xl text-yellow-500 hover:text-yellow-600"
              >
                {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
              </button>
              <button
                onClick={onClose}
                className="bg-[#121a35] text-white px-4 py-1 border-none text-[20px] rounded cursor-pointer"
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
            </div>
          </div>
        </div>
      </div>

      {/* 경고 모달 */}
      {alertMessage && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <p className="text-center text-lg mb-4">{alertMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={closeAlert}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
