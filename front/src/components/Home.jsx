import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { Link } from "react-router-dom";
import a0 from "../assets/a0.mp4"; // 배경 영상
import "./ImageSlider.css";
const Home = () => {
  const dispatch = useDispatch();
  const {
    festivalList = [],
    loading,
    error,
  } = useSelector((state) => state.festival);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(new Date());

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
      <h1 className="main-text">문화재 행사 일정</h1>
      {visibleFestivals.length === 0 ? (
        <p>표시할 축제 데이터가 없습니다.</p>
      ) : (
        <>
          <button
            className="arrow left"
            onClick={goToPrevious}
            aria-label="이전 축제"
          >
            &lt;
          </button>
          <div className="slider">
            {visibleFestivals.map((festival, index) => (
              <div
                key={festival?.id || index}
                className={`slide ${index === 1 ? "active" : ""}`}
              >
                <Link to={`/festival/${festival?.id || ""}`}>
                  {festival?.image && festival.image !== "N/A" ? (
                    <img
                      src={festival.image}
                      alt={festival?.programName || "Festival"}
                      className="slider-image"
                    />
                  ) : (
                    <div className="slider-placeholder">No Image</div>
                  )}
                </Link>
                <div className="slider-textbox">
                  <h2 className="slider-title">
                    {festival?.programName || "Unknown Festival"}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <button
            className="arrow right"
            onClick={goToNext}
            aria-label="다음 축제"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );
};
export default Home;
