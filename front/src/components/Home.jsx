import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";
import { Link } from "react-router-dom";
import a0 from "../assets/a0.mp4"; // 배경 영상
import "./ImageSlider.css";

const Home = () => {
  // console.log("test");
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

  useEffect(() => {
    console.log("Fetched festivalList:", festivalList);
  }, [festivalList]);

  // if (loading) return <p>Loading festival data...</p>;
  // if (error) return <p>Error: {error}</p>;
  // if (!festivalList || festivalList.length === 0)
  // return <p>No festivals to display.</p>;

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
        <p>No festival data available.</p>
      ) : (
        <>
          <button className="arrow left" onClick={goToPrevious}>
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
          <button className="arrow right" onClick={goToNext}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
