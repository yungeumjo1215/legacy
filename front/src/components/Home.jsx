import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { Link } from "react-router-dom";
import a0 from "../assets/a0.mp4"; // 배경 영상
import "./ImageSlider.css";
import Event_schedule from "./Event_schedule";

const Home = () => {
  const dispatch = useDispatch();
  const {
    festivalList = [],
    loading,
    error,
  } = useSelector((state) => state.festival);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchFestivalData());
  }, [dispatch]);

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

  const getVisibleFestivals = useMemo(() => {
    if (!festivalList || festivalList.length === 0) return [];
    const prevIndex = (currentIndex - 1 + totalFestivals) % totalFestivals;
    const nextIndex = (currentIndex + 1) % totalFestivals;
    return [
      festivalList[prevIndex],
      festivalList[currentIndex],
      festivalList[nextIndex],
    ];
  }, [currentIndex, festivalList, totalFestivals]);

  // 키보드 네비게이션 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (loading)
    return <p className="text-center mt-8">데이터를 불러오는 중...</p>;
  if (error)
    return <p className="text-center mt-8">오류가 발생했습니다: {error}</p>;
  if (!festivalList || festivalList.length === 0)
    return <p className="text-center mt-8">표시할 행사가 없습니다.</p>;

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
      <Link to={"/Event_schedule"}>
        <div>
          <h1 className="main-text">문화재 행사 일정</h1>
        </div>
      </Link>
      <div className="slider-container">
        {getVisibleFestivals.length === 0 ? (
          <p>표시할 행사 데이터가 없습니다.</p>
        ) : (
          <>
            <button
              className="arrow left"
              onClick={goToPrevious}
              aria-label="이전 행사 보기"
              onKeyDown={(e) => e.key === "Enter" && goToPrevious()}
            >
              &lt;
            </button>
            <div className="slider" role="region" aria-label="행사 슬라이더">
              {getVisibleFestivals.map((festival, index) => (
                <div
                  key={festival?.id || index}
                  className={`slide ${index === 1 ? "active" : ""}`}
                  role="group"
                  aria-label={festival?.programName || "행사"}
                >
                  <Link
                    to={`/festival/${festival?.id || ""}`}
                    aria-label={`${festival?.programName || "행사"} 상세 보기`}
                  >
                    {festival?.image && festival.image !== "N/A" ? (
                      <img
                        src={festival.image}
                        alt={festival?.programName || "행사 이미지"}
                        className="slider-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="slider-placeholder">이미지 없음</div>
                    )}
                  </Link>
                  <div className="slider-textbox">
                    <h2 className="slider-title">
                      {festival?.programName || "제목 없음"}
                    </h2>
                    <p className="slider-dates">
                      {festival?.startDate} - {festival?.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="arrow right"
              onClick={goToNext}
              aria-label="다음 행사 보기"
              onKeyDown={(e) => e.key === "Enter" && goToNext()}
            >
              &gt;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
