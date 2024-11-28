import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      const apiKey = process.env.REACT_APP_GOOGLE_MAP_API;
      console.log(apiKey);

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

    const initializeMap = () => {
      if (!mapRef.current) {
        console.error("mapRef가 DOM 요소에 연결되지 않았습니다.");
        return;
      }

      new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5326, lng: 127.024612 }, // 서울 중심 좌표
        zoom: 10,
      });
    };

    loadGoogleMapsScript();
  }, []);

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
