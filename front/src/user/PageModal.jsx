import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, addFavorites } from "../redux/slices/favoriteSlice";
import { AiFillStar } from "react-icons/ai";
import default_Img from "../assets/festival.png";
import axios from "axios";

const PageModal = ({ isOpen, onClose, item, type, onUpdate }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  if (!isOpen || !item) return null;

  const handleRemoveFavorite = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      const requestData = {
        id: type === "heritage" ? item.heritageid : item.festivalid,
        type: type === "heritage" ? "heritage" : "event",
      };

      await axios({
        method: "delete",
        url: "http://localhost:8000/pgdb/favoritelist",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestData,
      });

      dispatch(
        removeFavorite({
          type: type,
          id: type === "heritage" ? item.heritageid : item.festivalid,
        })
      );

      onClose();

      setTimeout(() => {
        if (onUpdate) {
          onUpdate(type);
        }
      }, 100);
    } catch (error) {
      console.error("즐겨찾기 제거 중 오류 발생:", error);
      if (error.response) {
        console.error("에러 상세:", error.response.data);
        console.error("에러 상태:", error.response.status);
        alert(
          `즐겨찾기 해제 실패: ${
            error.response.data.message || "서버 오류가 발생했습니다."
          }`
        );
      } else if (error.request) {
        console.error("서버 응답 없음:", error.request);
        alert("서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        console.error("에러 메시지:", error.message);
        alert("요청 설정 중 오류가 발생했습니다.");
      }
    }
  };

  const handleImageError = (e) => {
    e.target.src = default_Img;
    e.target.alt = "이미지를 불러올 수 없습니다";
  };

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
        style={{
          position: "fixed",
          zIndex: 2147483645,
        }}
      />
      <div
        className="fixed inset-0 w-full h-full flex justify-center items-center"
        style={{
          position: "fixed",
          zIndex: 2147483646,
        }}
        onClick={onClose}
      >
        <div
          className="relative bg-white text-black p-5 rounded-lg w-[90%] max-w-[800px] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[28px] m-0 MainFont break-words flex-1 pr-5">
              {type === "heritage" ? item.heritagename : item.festivalname}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRemoveFavorite}
                className="text-2xl text-yellow-500 hover:text-yellow-600"
              >
                <AiFillStar />
              </button>
              <button
                onClick={onClose}
                className="bg-blue-800 text-white px-4 py-1 border-none text-[25px] rounded cursor-pointer"
              >
                X
              </button>
            </div>
          </div>

          <img
            src={
              type === "heritage"
                ? item.heritageimageurl || default_Img
                : item.festivalimageurl || default_Img
            }
            alt={type === "heritage" ? item.heritagename : item.festivalname}
            onError={handleImageError}
            className="w-full rounded-lg mb-5 max-h-[350px] object-contain"
          />

          <p className="SubFont text-lg mb-5 box-border border border-[#7d7576] rounded-lg p-2.5 leading-relaxed whitespace-pre-line">
            {type === "heritage" ? item.heritagecontent : item.festivalcontent}
          </p>

          <div className="SubFont text-base mb-2.5 flex flex-col gap-2.5">
            {type === "heritage" ? (
              <>
                <p>
                  <strong className="MainFont">시대:</strong>{" "}
                  {item.heritagecccename}
                </p>
                <p>
                  <strong className="MainFont">위치:</strong>{" "}
                  {item.heritageaddress}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong className="MainFont">장소:</strong>{" "}
                  {item.festivallocation}
                </p>
                <p>
                  <strong className="MainFont">기간:</strong>{" "}
                  {item.festivalstartdate} ~ {item.festivalenddate}
                </p>
                <p>
                  <strong className="MainFont">문의:</strong>{" "}
                  {item.festivalcontact}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PageModal;
