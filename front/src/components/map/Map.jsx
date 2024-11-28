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
  const [getHeritageData, setgetHeritageData] = useState(null);
  const [error, setError] = useState("");

  // 문화재 정보를 가져오는 함수
  const fetchHeritageData = async () => {
    try {
      const response = await axios.get(getHeritageData);

      const data = response.fetchGetHeritageData;
      setHeritageData(data);
      setError("");
    } catch (error) {
      setError("문화재 정보를 불러오는 데 실패했습니다.");
    }
  };

  // 페이지 로드시 문화재 데이터를 가져옵니다.
  useEffect(() => {
    fetchHeritageData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ height: "500px", marginTop: "20px", height: "800px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API}>
          <GoogleMap
            id="google-map"
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 37.5665, lng: 126.978 }} // 기본 서울 설정
            zoom={16}
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
                  onClick={() => setgetHeritageData(heritage)}
                />
              );
            })}
            console.log(fetchGetHeritageData);
            {getHeritageData && (
              <InfoWindow
                position={{
                  lat: parseFloat(getHeritageData.latitude),
                  lng: parseFloat(getHeritageData.longitude),
                }}
                onCloseClick={() => setgetHeritageData(null)}
              >
                <div>
                  <h2>{getHeritageData.culturalPropertyName}</h2>
                  <p>{getHeritageData.sido}</p>
                  <p>{getHeritageData.sigungu}</p>
                  <p>{getHeritageData.kind}</p>
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
