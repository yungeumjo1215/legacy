import React, { useEffect, useState } from "react";

const LocalStorageViewer = () => {
  const [favoriteFestivals, setFavoriteFestivals] = useState([]);
  const [favoriteHeritages, setFavoriteHeritages] = useState([]);

  useEffect(() => {
    // Fetch data from localStorage
    const festivals =
      JSON.parse(localStorage.getItem("favoriteFestivals")) || [];
    const heritages =
      JSON.parse(localStorage.getItem("favoriteHeritages")) || [];

    // Set the data in state
    setFavoriteFestivals(festivals);
    setFavoriteHeritages(heritages);

    // Log data to the console for debugging
    console.log("Favorite Festivals:", festivals);
    console.log("Favorite Heritages:", heritages);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Local Storage Data Viewer</h2>
      <div>
        <h3>Favorite Festivals</h3>
        {favoriteFestivals.length > 0 ? (
          <ul>
            {favoriteFestivals.map((festival, index) => (
              <li key={index}>
                <strong>{festival.programName}</strong>:{" "}
                {festival.programContent || "No content available"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite festivals saved.</p>
        )}
      </div>
      <div>
        <h3>Favorite Heritages</h3>
        {favoriteHeritages.length > 0 ? (
          <ul>
            {favoriteHeritages.map((heritage, index) => (
              <li key={index}>
                <strong>{heritage.ccbaMnm1 || "Unknown Heritage"}</strong>:{" "}
                {heritage.content || "No content available"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite heritages saved.</p>
        )}
      </div>
    </div>
  );
};

export default LocalStorageViewer;
