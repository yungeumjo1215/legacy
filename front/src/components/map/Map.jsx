import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

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
          zoom: 15,
        });

        mapInstanceRef.current = map;

        const heritageData = await fetchGetHeritageData();
        const geocodedData = await geocodeHeritageData(heritageData);

        if (isMounted) {
          setGeocodedHeritageData(geocodedData);

          geocodedData.forEach((heritage) => {
            if (!heritage) return;

            const marker = new window.google.maps.Marker({
              position: { lat: heritage.latitude, lng: heritage.longitude },
              map,
              title: heritage.name,
              animation: window.google.maps.Animation.DROP,
            });

            const infoWindowContent = (heritage) => `
              <div style="
                padding: 15px;
                max-width: 350px;
                font-family: 'Noto Sans KR', sans-serif;
              ">
                ${
                  heritage.imageUrl
                    ? `
                  <div style="
                    width: 100%;
                    height: 200px;
                    margin-bottom: 15px;
                    overflow: hidden;
                    border-radius: 8px;
                  ">
                    <img 
                      src="${heritage.imageUrl}" 
                      alt="${heritage.name}" 
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      "
                    >
                  </div>
                `
                    : ""
                }
                
                <h3 style="
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                  color: #121a35;
                ">${heritage.name}</h3>
                
                <p style="
                  font-size: 14px;
                  line-height: 1.5;
                  color: #666;
                  margin-bottom: 10px;
                  max-height: 100px;
                  overflow-y: auto;
                ">${heritage.description}</p>
                
                
                </div>
              </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
              content: infoWindowContent(heritage),
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
        const response = await axios.get("http://localhost:8000/heritage");
        if (!response.data) throw new Error("데이터를 불러오는데 실패했습니다");
        return response.data;
      } catch (error) {
        console.error("유적지 데이터를 가져오는 중 오류 발생:", error);
        setError("유적지 데이터를 불러오는데 실패했습니다");
        return [];
      }
    };

    const geocodeHeritageData = async (heritageData) => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;

      const geocodedData = await Promise.all(
        heritageData.map(async (heritage) => {
          const cacheKey = heritage.ccbaLcad;

          // 캐시된 결과가 있으면 사용
          if (geocodeCache.current.has(cacheKey)) {
            return geocodeCache.current.get(cacheKey);
          }

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json`,
              {
                params: {
                  address: heritage.ccbaLcad,
                  key: apiKey,
                },
              }
            );

            if (response.data.status === "OK") {
              const location = response.data.results[0].geometry.location;
              const result = {
                name: heritage.ccbaMnm1,
                description: heritage.ccbaLcad,
                latitude: location.lat,
                longitude: location.lng,
                imageUrl: heritage.imageUrl,
              };

              // 결과 캐싱
              geocodeCache.current.set(cacheKey, result);
              return result;
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

      return geocodedData.filter((data) => data !== null);
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div>
      <div className="map-loading-error-container fixed z-[9999] w-[80%] bg-white">
        {isLoading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            지도를 불러오는 중...
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "red",
              backgroundColor: "#ffe6e6",
              borderRadius: "4px",
              margin: "10px",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "888px",
          border: "1px solid #ccc",
          display: error ? "none" : "block",
        }}
      />
    </div>
  );
};

export default Map;
