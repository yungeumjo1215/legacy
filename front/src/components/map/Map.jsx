import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import markerIcon from "../../assets/Location_icon.gif";

const Map = ({ selectedLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [geocodedHeritageData, setGeocodedHeritageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // JavaScript Map 객체 생성
  const geocodeCache = useRef(new window.Map());

  // selectedLocation이 변경될 때마다 지도 중심 이동
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(
        new window.google.maps.LatLng(
          selectedLocation.lat,
          selectedLocation.lng
        )
      );
      mapInstanceRef.current.setZoom(15); // 적절한 줌 레벨로 설정
    }
  }, [selectedLocation]);

  useEffect(() => {
    let isMounted = true;
    const markers = [];
    const infoWindows = [];

    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;

      if (!apiKey || apiKey.trim() === "") {
        setError("Google Maps API 키가 설정되지 않았습니다");
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
        script.onerror = () => {
          setError("Google Maps 스크립트 로드에 실패했습니다");
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = async () => {
      if (!isMounted) return;

      if (!mapRef.current) {
        setError("지도를 초기화할 수 없습니다");
        setIsLoading(false);
        return;
      }

      try {
        const currentPosition = await getCurrentPosition();

        const map = new window.google.maps.Map(mapRef.current, {
          center: currentPosition,
          zoom: 12,
          // 지도 타입 컨트롤 (지도/위성)
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },
          // 기타 컨트롤 옵션들
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          streetViewControl: true,
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },
        });

        mapInstanceRef.current = map;

        // 지도 클릭 이벤트 리스너 추가
        map.addListener("click", () => {
          // 모든 InfoWindow 닫기
          infoWindows.forEach((window) => window.close());
        });

        const heritageData = await fetchGetHeritageData();
        const geocodedData = await geocodeHeritageData(heritageData);

        if (isMounted) {
          setGeocodedHeritageData(geocodedData);

          geocodedData.forEach((heritageGroup, i) => {
            if (!heritageGroup || heritageGroup.length === 0) return;

            const firstHeritage = heritageGroup[0];
            const marker = new window.google.maps.Marker({
              position: {
                lat: firstHeritage.latitude,
                lng: firstHeritage.longitude,
              },
              map,
              title:
                heritageGroup.length > 1
                  ? `${firstHeritage.name} 외 ${heritageGroup.length - 1}개`
                  : firstHeritage.name,
              animation: window.google.maps.Animation.DROP,
              icon: {
                url: markerIcon,
                scaledSize: new window.google.maps.Size(50, 50), // 아이콘 크기 조절
                origin: new window.google.maps.Point(10, 0),
                anchor: new window.google.maps.Point(16, 32),
              },
            });

            const infoWindowContent = (heritageGroup) => `
              <div style="
                padding: 0;
                margin: 0;
                max-width: 350px;
                font-family: 'Noto Sans KR', sans-serif;
              ">
                ${heritageGroup
                  .map(
                    (heritage) => `
                  <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    ${
                      heritage.imageUrl
                        ? `<div style="
                          width: 100%;
                          height: 250px;
                          margin: 0;
                          padding: 0;
                          overflow: hidden;
                          border-radius: 8px 8px 0 0;
                        ">
                          <img 
                            src="${heritage.imageUrl}" 
                            alt="${heritage.name}" 
                            style="
                              width: 100%;
                              height: 100%;
                              object-fit: cover;
                              display: block;
                              margin: 0;
                              padding: 0;
                            "
                          />
                        </div>`
                        : ""
                    }
                    <h3 style="
                      font-size: 18px;
                      font-weight: bold;
                      margin: 8px;
                      color: #121a35;
                    ">${heritage.name}</h3>
                    <p style="
                      font-size: 14px;
                      line-height: 1.5;
                      color: #666;
                      margin: 8px;
                      max-height: 100px;
                      overflow-y: auto;
                    ">${heritage.description}</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
              content: infoWindowContent(heritageGroup),
              maxWidth: 350,
            });

            marker.addListener("click", () => {
              // 다른 인포윈도우들을 닫음
              infoWindows.forEach((window) => window.close());

              // 지도 중심을 마커 위치로 부드럽게 이동
              mapInstanceRef.current.panTo(marker.getPosition());

              // 적절한 줌 레벨로 설정
              mapInstanceRef.current.setZoom(15);

              // 마커 바운스 애니메이션 추가
              marker.setAnimation(window.google.maps.Animation.BOUNCE);
              setTimeout(() => {
                marker.setAnimation(null);
              }, 750); // 0.75초 후 애니메이션 중지

              // 인포윈도우 열기
              infoWindow.open(map, marker);
            });

            markers.push(marker);
            infoWindows.push(infoWindow);
          });
        }
      } catch (err) {
        if (isMounted) {
          setError("지도를 초기화하는 중 오류가 발생했습니다");
          console.error("Map initialization error:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const getCurrentPosition = () => {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              // 위치 정보 획득 실패 시 서울 좌표로 기본 설정
              resolve({ lat: 37.5326, lng: 127.024612 });
            }
          );
        } else {
          resolve({ lat: 37.5326, lng: 127.024612 });
        }
      });
    };

    const fetchGetHeritageData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/pgdb/heritage");
        if (!response.data) throw new Error("데이터를 불러오는데 실패했습니다");
        return response.data;
      } catch (error) {
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);
        setError("유적지 데이터를 불러오는데 실패했습니다");
        return [];
      }
    };

    const geocodeHeritageData = async (heritageData) => {
      // Map 대신 일반 객체 사용
      const locationGroups = {};

      heritageData.forEach((heritage) => {
        if (heritage.lat && heritage.lng) {
          const locationKey = `${heritage.lat},${heritage.lng}`;

          if (!locationGroups[locationKey]) {
            locationGroups[locationKey] = [];
          }

          locationGroups[locationKey].push({
            name: heritage.ccbamnm1,
            description: heritage.ccbalcad,
            latitude: parseFloat(heritage.lat),
            longitude: parseFloat(heritage.lng),
            imageUrl: heritage.imageurl,
          });
        }
      });

      // 객체의 값들만 배열로 변환
      return Object.values(locationGroups);
    };

    loadGoogleMapsScript();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="map-loading-error-container fixed z-[9999] w-[80%] bg-white">
        {isLoading && (
          <div className="SubFont text-center p-[20px]">
            지도를 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center p-5 text-red-600 bg-red-100 rounded-md m-2.5">
            {error}
          </div>
        )}
      </div>

      <div
        className={`w-full h-[888px] border border-gray-300 ${
          error ? "none" : "block"
        }`}
        ref={mapRef}
      />
    </div>
  );
};

export default Map;
