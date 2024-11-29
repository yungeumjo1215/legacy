import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Map = () => {
  const mapRef = useRef(null);
  const [geocodedHeritageData, setGeocodedHeritageData] = useState([]); // 지오코딩된 유적지 데이터

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;

      if (!apiKey) {
        console.error("Google Maps API Key가 설정되지 않았습니다.");
        return;
      }

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeMap();
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = async () => {
      if (!mapRef.current) {
        console.error("mapRef가 DOM 요소에 연결되지 않았습니다.");
        return;
      }

      // Google Maps 초기화
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5326, lng: 127.024612 }, // 서울 중심 좌표
        zoom: 12,
      });

      // Heritage 데이터 가져오기 및 Geocoding
      const heritageData = await fetchGetHeritageData();
      const geocodedData = await geocodeHeritageData(heritageData);
      setGeocodedHeritageData(geocodedData);

      // Heritage 데이터를 지도에 마커로 표시
      geocodedData.forEach((heritage) => {
        const { latitude, longitude, name, description, imageUrl } = heritage;

        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title: name,
        });

        // 마커 클릭 시 정보창 표시
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <img src="${imageUrl}" alt="${name}" style="width:200px; height:auto; margin-top:10px;" />
              <h3>${name}</h3>
              <p>${description}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    };

    // Heritage 데이터 가져오기
    const fetchGetHeritageData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/heritage");
        return response.data; // 유적지 데이터 반환
      } catch (error) {
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);
        return [];
      }
    };

    // Heritage 데이터를 지오코딩하여 위도와 경도 변환
    const geocodeHeritageData = async (heritageData) => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;

      const geocodedData = await Promise.all(
        heritageData.map(async (heritage) => {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json`,
              {
                params: {
                  address: heritage.ccbaLcad, // 주소 데이터
                  key: apiKey,
                },
              }
            );

            if (response.data.status === "OK") {
              const location = response.data.results[0].geometry.location;
              return {
                name: heritage.ccbaMnm1,
                description: heritage.ccbaLcad,
                latitude: location.lat,
                longitude: location.lng,
                image: heritage.imageUrl,
              };
            } else {
              console.error(
                `Geocoding 실패: ${heritage.ccbaLcad} - ${response.data.status}`
              );
              return null;
            }
          } catch (error) {
            console.error(
              `Geocoding 요청 중 오류 발생: ${heritage.ccbaLcad}`,
              error
            );
            return null;
          }
        })
      );

      return geocodedData.filter((data) => data !== null); // 유효한 데이터만 반환
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div>
      <div></div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "800px",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
};

export default Map;
