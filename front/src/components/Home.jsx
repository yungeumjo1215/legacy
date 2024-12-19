import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { Link } from "react-router-dom";
import a0 from "../assets/a0.mp4";
import b1 from "../assets/b1.mp4";
import "./ImageSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { BsChatDotsFill } from "react-icons/bs";
import default_Img from "../assets/festival.png";
import EventModal from "./events/EventModal";

const Home = () => {
  const dispatch = useDispatch();
  const { festivalList } = useSelector((state) => state.festival);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    dispatch(fetchFestivalData({ year, month }));
  }, [dispatch]);

  useEffect(() => {
    console.log(swiperInstance);
    if (swiperInstance?.navigation && prevRef.current && nextRef.current) {
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  //스크롤 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); //300px 이상 스크롤 시 맨 위로 가기 버튼 표시
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 행재 날짜에 해당하는 행사만 필터링
  const formattedEvents =
    festivalList
      ?.filter((festival) => {
        const today = new Date();
        const todayString = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD 형식으로 변환

        const startDate = festival.startDate?.[0] || festival.startDate;
        const endDate = festival.endDate?.[0] || festival.endDate;

        // 오늘 날짜가 시작일과 종료일 사이에 있는지 확인
        return todayString >= startDate && todayString <= endDate;
      })
      .map((festival) => ({
        festivalid: festival.festivalid?.[0] || festival.festivalid,
        programName: festival.programName?.[0] || festival.programName,
        programContent: festival.programContent?.[0] || festival.programContent,
        startDate: festival.startDate?.[0] || festival.startDate,
        endDate: festival.endDate?.[0] || festival.endDate,
        location: festival.location?.[0] || festival.location,
        contact: festival.contact?.[0] || festival.contact,
        image: festival.image?.[0] || festival.image,
        targetAudience: festival.targetAudience?.[0] || festival.targetAudience,
        fee: festival.fee?.[0] || festival.fee,
        homepage: festival.homepage?.[0] || festival.homepage,
        placeInfo: festival.placeInfo?.[0] || festival.placeInfo,
        transportation: festival.transportation?.[0] || festival.transportation,
        category: festival.category?.[0] || festival.category,
      })) || [];

  // 이벤트 클릭 핸들러 수정
  const handleEventClick = (festival) => {
    setSelectedEvent({
      festivalid: festival.festivalid,
      programName: festival.programName,
      programContent: festival.programContent,
      startDate: festival.startDate,
      endDate: festival.endDate,
      location: festival.location,
      contact: festival.contact,
      image: festival.image,
      targetAudience: festival.targetAudience,
      hideStarButton: true,
    });
  };

  // 모달 닫기 함수 추가
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div style={{ paddingTop: "4rem" }}>
      <div className="w-full max-w-[1600px] h-[calc(100vh-4rem)] mx-auto px-4 mb-8 flex justify-center items-center bg-white">
        <div className="relative w-full h-full">
          <div className="overlay w-full h-full left-0 top-0 absolute opacity-20"></div>
          <video
            src={a0}
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-contain"
          ></video>
        </div>
      </div>
      <div className="flex flex-col items-center bg-white w-full">
        <h1 className="main-text">문화 행사 안내</h1>
        <div className="w-full max-w-[1600px] mx-auto px-4 mb-8 flex justify-start">
          <Link
            to="/event_schedule"
            className="bg-blue-900 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out block"
            style={{
              width: "clamp(120px, 15vw, 160px)",
              height: "clamp(35px, 5vw, 50px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(18px, 1.2vw, 22px)",
            }}
          >
            <span className="text-center SubFont">상세페이지</span>
          </Link>
        </div>
        <div className="w-full h-[600px] max-w-[1600px] mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={4}
            loop={true}
            onSwiper={setSwiperInstance}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              // dynamicBullets: true, (갯수제한)
              // dynamicMainBullets: 10,  (갯수제한)
              el: ".pagination-bullets",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
              modifierClass: "custom-pagination-",
              bulletElement: "span",
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              enabled: true, // 자동 재생 활성화
            }}
            breakpoints={{
              // 320px 이상일 때
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              // 768px 이상일 때
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              // 1024px 이상일 때
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              // 1280px 이상일 때 (새로 추가)
              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="relative py-10 pb-20 custom-pagination"
          >
            {formattedEvents.map((festival) => (
              <SwiperSlide key={festival.festivalid}>
                <div
                  onClick={() => handleEventClick(festival)}
                  className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="relative h-[300px]">
                    {festival.image ? (
                      <img
                        src={festival.image}
                        alt={festival.programName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = default_Img;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p className="text-gray-500">이미지 없음</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 truncate">
                      {festival.programName}
                    </h2>
                    <p className="text-gray-600 mb-2 truncate">
                      {festival.location}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>시작일: {festival.startDate}</p>
                      <p>종료일: {festival.endDate}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="bg-white flex items-center justify-center w-full">
            <div className="pagination-bullets-container relative w-full max-w-6xl mx-auto px-4 py-8">
              <button
                ref={prevRef}
                className="absolute left-4 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-10 transition-all duration-300 ease-in-out"
                aria-label="이전 축제"
              >
                <IoIosArrowBack size={24} />
              </button>
              <div className="pagination-bullets">
                <div className="swiper-pagination"></div>
              </div>

              <button
                ref={nextRef}
                className="absolute right-4 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-10 transition-all duration-300 ease-in-out"
                aria-label="다음 축제"
              >
                <IoIosArrowForward size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1600px] h-[400px] mx-auto mt-8 mb-16 px-4">
          <Link to="/search" className="w-full h-full block">
            <div className="w-full h-full bg-gray-100 rounded-lg shadow-lg overflow-hidden relative">
              <video
                src={b1}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              ></video>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-start items-start text-white p-8">
                <h2 className="MainFont text-4xl font-bold mb-4">
                  국가 유산 위치 검색
                </h2>
                <p className="SubFont text-sm max-w-2xl">
                  국가유산 정보와 지도 정보가 결합한 공간 정보 활용체계입니다.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* 맨 위로 가기 버튼 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 ease-in-out"
          aria-label="맨 위로 가기"
        >
          <IoIosArrowUp size={24} />
        </button>
      )}
      {/* 챗봇 버튼 추가 */}
      <Link
        to="/chatbot"
        className="fixed bottom-8 left-8 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 ease-in-out hover:scale-110 animate-bounce"
        aria-label="챗봇으로   동"
      >
        <BsChatDotsFill size={24} />
      </Link>
      {/* EventModal 컴포넌트 추가 */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          hideStarButton={true}
        />
      )}
    </div>
  );
};

export default Home;
