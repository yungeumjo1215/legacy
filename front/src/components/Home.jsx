import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 가져오기
import a2 from "../assets/a2.png"; // 배경 이미지
import a0 from "../assets/a0.mp4"; // 배경 영상

import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";
import img5 from "../assets/image5.png";

import "./ImageSlider.css";

const Home = () => {
  const images = [img1, img2, img3, img4, img5]; // 슬라이더 이미지 배열
  const texts = [
    "밤의 석조전",
    "창덕궁 달빛기행",
    "경복궁 수문장 교대의식",
    "인천공항 왕가의 산책",
    "2024 경복궁 수문장 순라의식",
  ]; // 각 이미지에 대한 텍스트

  const links = [
    "/page1", // 첫 번째 이미지 링크
    "/page2", // 두 번째 이미지 링크
    "/page3", // 세 번째 이미지 링크
    "/page4", // 네 번째 이미지 링크
    "/page5", // 다섯 번째 이미지 링크
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  // 이전 슬라이드로 이동
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  // 현재 슬라이드와 인접한 이미지를 계산
  const getVisibleImages = () => {
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    const nextIndex = (currentIndex + 1) % totalImages;
    return [
      {
        image: images[prevIndex],
        text: texts[prevIndex],
        link: links[prevIndex],
      },
      {
        image: images[currentIndex],
        text: texts[currentIndex],
        link: links[currentIndex],
      },
      {
        image: images[nextIndex],
        text: texts[nextIndex],
        link: links[nextIndex],
      },
    ];
  };

  const visibleImages = getVisibleImages();

  return (
    <div style={{ paddingTop: "4rem" }}>
      {" "}
      {/* 네비게이션 높이만큼 상단 여백 추가 */}
      {/* 배경 동영상 */}
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
      {/* Heading for "문화재 행사 일정" */}
      <h1 className="main-text">문화재 행사 일정</h1>
      {/* 슬라이더 섹션 */}
      <div className="slider-container">
        <button className="arrow left" onClick={goToPrevious}>
          &lt;
        </button>
        <div className="slider">
          {visibleImages.map((item, index) => (
            <div key={index} className={`slide ${index === 1 ? "active" : ""}`}>
              <Link to={item.link}>
                {" "}
                {/* Link 컴포넌트로 페이지 이동 설정 */}
                <img
                  src={item.image}
                  alt={`Slide ${index}`}
                  className="slider-image"
                />
              </Link>
              <div className="slider-textbox">
                <p className="slider-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
