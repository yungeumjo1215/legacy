import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const Map = () => {
  const [heritageData, setHeritageData] = useState([]);
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [error, setError] = useState("");

  const heritageApiKey = "http://www.khs.go.kr/cha/SearchKindOpenapiDt.do"; // 국가유산청 API 키

  // 문화재 정보를 가져오는 함수
  const fetchHeritageData = async () => {
    try {
      const response = await axios.get(
        `http://apis.data.go.kr/6290000/culturalheritage/search?serviceKey=${heritageApiKey}&numOfRows=10&pageNo=1`
      );

      const data = response.data.response.body.items.item;
      setHeritageData(data);
      setError("");
    } catch (err) {
      setError("문화재 정보를 불러오는 데 실패했습니다.");
    }
  };

  // 페이지 로드시 문화재 데이터를 가져옵니다.
  useEffect(() => {
    fetchHeritageData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>문화재 위치 지도</h1>
      {error && <p>{error}</p>}

      <div style={{ height: "500px", marginTop: "20px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API}>
          <GoogleMap
            id="google-map"
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 37.5665, lng: 126.978 }} // 기본 서울 설정
            zoom={12}
          >
            {heritageData.map((heritage, index) => {
              const latitude = heritage.latitude;
              const longitude = heritage.longitude;

              // 위도, 경도 정보가 없으면 마커를 표시하지 않음
              if (!latitude || !longitude) return null;

              return (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  }}
                  onClick={() => setSelectedHeritage(heritage)}
                />
              );
            })}

            {selectedHeritage && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedHeritage.latitude),
                  lng: parseFloat(selectedHeritage.longitude),
                }}
                onCloseClick={() => setSelectedHeritage(null)}
              >
                <div>
                  <h2>{selectedHeritage.culturalPropertyName}</h2>
                  <p>{selectedHeritage.sido}</p>
                  <p>{selectedHeritage.sigungu}</p>
                  <p>{selectedHeritage.kind}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;
