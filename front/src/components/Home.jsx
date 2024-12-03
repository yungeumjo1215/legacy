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
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Home = () => {
  const dispatch = useDispatch();
  const eventState = useSelector((state) => state.event);
  const event = eventState?.event || [];
  const loading = eventState?.loading || false;
  const error = eventState?.error || null;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    dispatch(fetchEvent())
      .unwrap()
      .then((result) => {
        // console.log("Fetch success:", result);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (swiperInstance?.navigation && prevRef.current && nextRef.current) {
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

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
      <div className="flex flex-col items-center bg-white w-full">
        <h1 className="main-text">문화 행사 안내</h1>
        <div className="w-full max-w-[1600px] mx-auto px-4 mb-8 flex justify-end">
          <Link
            to="/event_schedule"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out block"
            style={{
              width: "clamp(120px, 15vw, 200px)",
              height: "clamp(35px, 5vw, 50px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(14px, 1.5vw, 16px)",
            }}
          >
            <span className="text-center">상세페이지</span>
          </Link>
        </div>
        {event.length === 0 ? (
          <p>표시할 행사 데이터가 없습니다.</p>
        ) : (
          <div className="w-full h-[800px] max-w-[1600px] mx-auto px-4">
            <Swiper
              modules={[Navigation, Pagination]}
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
                dynamicBullets: true,
                dynamicMainBullets: 10,
                el: ".pagination-bullets",
                bulletClass: "swiper-pagination-bullet custom-bullet",
                bulletActiveClass:
                  "swiper-pagination-bullet-active custom-bullet-active",
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
              {event.slice(0, 10).map((event) => (
                <SwiperSlide key={event.title}>
                  <Link
                    to={`/event/${event.title}`}
                    className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-[500px]">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "기본이미지URL";
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
            </Swiper>
            <div className="bg-white flex items-center justify-center w-full">
              <div className="pagination-bullets-container relative w-full max-w-6xl mx-auto px-4 py-8">
                <button
                  ref={prevRef}
                  className="absolute left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg z-10 transition-all duration-300 ease-in-out"
                  aria-label="이전 축제"
                >
                  <IoIosArrowBack size={24} />
                </button>
                <div className="pagination-bullets">
                  <div className="swiper-pagination"></div>
                </div>

                <button
                  ref={nextRef}
                  className="absolute right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg z-10 transition-all duration-300 ease-in-out"
                  aria-label="다음 축제"
                >
                  <IoIosArrowForward size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
