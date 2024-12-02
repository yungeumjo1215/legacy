import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
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
  const {
    festivalList = [],
    loading,
    error,
  } = useSelector((state) => state.festival);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    dispatch(fetchFestivalData({ year, month }));
  }, [date, dispatch]);

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

  const totalFestivals = festivalList.length;
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
    if (!festivalList || festivalList.length === 0) return [];
    const prevIndex = (currentIndex - 1 + totalFestivals) % totalFestivals;
    const nextIndex = (currentIndex + 1) % totalFestivals;
    return [
      festivalList[prevIndex],
      festivalList[currentIndex],
      festivalList[nextIndex],
    ];
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

        {festivalList.length === 0 ? (
          <p>표시할 축제 데이터가 없습니다.</p>
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
              {festivalList.map((festival) => (
                <SwiperSlide key={festival.id}>
                  <Link
                    to={`/festival/${festival.id}`}
                    className="block bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-2">
                        {festival.programName || "Unknown Festival"}
                      </h2>
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
                    className="bg-white rounded-full p-2 shadow-lg z-10 ml-15 translate-y-2"
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
