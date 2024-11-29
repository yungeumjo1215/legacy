import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Map = () => {
  // 컴포넌트 이름을 Map에서 MapComponent로 변경
  const mapRef = useRef(null);
  const [geocodedHeritageData, setGeocodedHeritageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // JavaScript Map 객체 생성
  const geocodeCache = useRef(new window.Map());

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
        });

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
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div>            
                  <h3>${heritage.name}</h3>
                  <p>${heritage.description}</p>
                  ${
                    heritage.imageUrl
                      ? `<img src="${heritage.imageUrl}" alt="${heritage.name}" style="max-width: 200px;">`
                      : ""
                  }
                </div>
              `,
            });

            marker.addListener("click", () => {
              // 다른 인포윈도우들을 닫음
              infoWindows.forEach((window) => window.close());
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

    // 클린업 함수
    return () => {
      isMounted = false;
      // 마커와 인포윈도우 정리
      markers.forEach((marker) => marker.setMap(null));
      infoWindows.forEach((window) => window.close());
    };
  }, []);

  return (
    <div>
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

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "800px",
          border: "1px solid #ccc",
          display: error ? "none" : "block",
        }}
      />
    </div>
  );
};

export default Map;
