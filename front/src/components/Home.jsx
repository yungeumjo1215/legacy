import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../redux/slices/eventSlice";
import { Link } from "react-router-dom";
import a0 from "../assets/a0.mp4"; // 배경 영상
import "./ImageSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const dispatch = useDispatch();
  const eventState = useSelector((state) => state.event);
  const event = eventState?.event || [];
  const loading = eventState?.loading || false;
  const error = eventState?.error || null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    console.log("Dispatching fetchEvent");
    dispatch(fetchEvent())
      .unwrap()
      .then((result) => {
        console.log("Fetch success:", result);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">잠시만 기다려주세요...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">에러: {error}</p>
      </div>
    );

  const totalFestivals = event.length;
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalFestivals - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalFestivals - 1 ? 0 : prevIndex + 1
    );
  };
  const getVisibleFestivals = () => {
    if (!event || event.length === 0) return [];
    const prevIndex = (currentIndex - 1 + totalFestivals) % totalFestivals;
    const nextIndex = (currentIndex + 1) % totalFestivals;
    return [event[prevIndex], event[currentIndex], event[nextIndex]];
  };
  const visibleFestivals = getVisibleFestivals();
  return (
    <div style={{ paddingTop: "4rem" }}>
      <div className="w-full">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <div className="overlay w-full h-full left-0 top-0 absolute opacity-20"></div>
          <video
            src={a0}
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
          ></video>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gray-300 ">
        <h1 className="MainFont">
          문화재 행사 안내
          <p className="SubFont ">전국 축제 행사 일정</p>
        </h1>

        {event.length === 0 ? (
          <p>표시할 행사 데이터가 없습니다.</p>
        ) : (
          <div className="w-full h-[800px] max-w-6xl mx-auto px-4">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={25}
              slidesPerView={3}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 7,
                el: ".pagination-bullets",
              }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              className="relative py-10"
            >
              {event.slice(0, 6).map((event) => (
                <SwiperSlide key={event.title}>
                  <Link
                    to={`/event/${event.title}`}
                    className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-[400px]">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "기본이미지URL"; // 이미지 로드 실패시 기본 이미지
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
                        {event.title || "제목 없음"}
                      </h2>
                      <p className="text-gray-600 mb-2 truncate">
                        {event.host_inst_nm}
                      </p>
                      <div className="text-sm text-gray-500">
                        <p>시작일: {event.begin_de}</p>
                        <p>시간 정보: {event.event_tm_info}</p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center pb-4">
                <div className="pagination-bullets-container flex items-center justify-center w-full">
                  <button
                    ref={prevRef}
                    className="bg-white rounded-full p-2 shadow-lg z-10 mr-15 translate-y-2"
                    aria-label="이전 축제"
                  >
                    &lt;
                  </button>
                  <div className="pagination-bullets">
                    <div className="swiper-pagination"></div>
                  </div>
                  <button
                    ref={nextRef}
                    className="bg-white rounded-full p-2 shadow-lg z-10 ml-1 translate-y-2"
                    aria-label="다음 축제"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
