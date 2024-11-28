import React, { useEffect, useRef } from "react";
import axios from "axios";

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver 설정
    const element = mapRef.current;
    if (!element) {
      console.error("mapRef가 유효한 DOM 요소에 연결되지 않았습니다.");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("요소가 화면에 보입니다!");
        }
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []); // IntersectionObserver만 처리

  useEffect(() => {
    let map;

    // Google Maps 스크립트 동적 로드
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement("script");
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API; // 환경 변수 사용
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeMap(); // 스크립트 로드 완료 후 지도 초기화
        document.head.appendChild(script);
      } else {
        initializeMap(); // 이미 로드된 경우 초기화 바로 실행
      }
    };

    // Google Maps 초기화 함수
    const initializeMap = async () => {
      const heritageData = await fetchHeritageData();

      // Google Maps 인스턴스 생성
      map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5326, lng: 127.024612 }, // 서울 중심 좌표
        zoom: 10,
      });

      // 지도에 마커 추가
      if (heritageData) {
        heritageData.forEach((heritage) => {
          const marker = new window.google.maps.Marker({
            position: { lat: heritage.latitude, lng: heritage.longitude },
            map,
            title: heritage.name,
          });

          // 마커 클릭 시 정보창 표시
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<h3>${heritage.name}</h3><p>${heritage.description}</p>`,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }
    };

    // 유적지 데이터 가져오기 함수
    const fetchHeritageData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/heritage");
        return response.data;
      } catch (error) {
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);
        return [];
      }
    };

    // 스크립트 로드 실행
    loadGoogleMapsScript();

    return () => {
      if (map) {
        map = null; // 지도 인스턴스 제거
      }
    };
  }, []); // Google Maps 초기화만 처리

  return (
    <div>
      <h1>Google Maps Heritage Map</h1>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};

export default Map;
