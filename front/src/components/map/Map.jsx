import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

// Mapbox access token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

const Map = () => {
  const [heritageList, setHeritageList] = useState([]);
  const [map, setMap] = useState(null);

  // Fetch heritage list from the backend
  useEffect(() => {
    const fetchHeritageList = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/heritage");
        setHeritageList(response.data);
      } catch (error) {
        console.error("Error fetching heritage data:", error);
      }
    };

    fetchHeritageList();
  }, []);

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map", // ID of the container div
        style: "mapbox://styles/mapbox/streets-v11", // Map style
        center: [127.024612, 37.5326], // Initial center (longitude, latitude)
        zoom: 10, // Initial zoom level
      });

      setMap(mapInstance);

      // Cleanup map on unmount
      return () => mapInstance.remove();
    };

    initializeMap();
  }, []);

  // Add markers to the map
  useEffect(() => {
    if (map && heritageList.length) {
      heritageList.forEach((heritage) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([heritage.longitude, heritage.latitude]) // Use longitude & latitude
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText(
              `${heritage.name}\n${heritage.description}`
            )
          ) // Add popup with name and description
          .addTo(map);
      });
    }
  }, [map, heritageList]);

  return (
    <div>
      <h1>Heritage Map</h1>
      <div
        id="map"
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};

export default Map;
