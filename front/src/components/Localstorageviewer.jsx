import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../redux/slices/favoriteSlice";
import { loginSuccess } from "../redux/slices/authSlice"; // Assuming you have an auth slice

const LocalStorageViewer = () => {
  const dispatch = useDispatch();

  // Access Redux state
  const {
    favoriteFestivals = [],
    favoriteHeritages = [],
    status,
    error,
  } = useSelector((state) => state.favorites);

  const { isLoggedIn } = useSelector((state) => state.auth); // Assuming you track login status in auth slice

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // Handle token-based login and fetch favorites
  useEffect(() => {
    if (token && !isLoggedIn) {
      // Dispatch login action if token exists but user isn't logged in
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user details from localStorage
      if (user) {
        dispatch(
          loginSuccess({
            token,
            user,
          })
        );
      }
    }

    if (token) {
      // Fetch favorites if the token exists
      dispatch(fetchFavorites(token));
    }
  }, [dispatch, token, isLoggedIn]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>

      {/* Loading and Error States */}
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && (
        <p className="text-red-500">Error: {error || "Failed to load data."}</p>
      )}

      {/* Favorite Festivals */}
      <h2 className="text-xl font-semibold mt-4">Favorite Festivals</h2>
      {status === "succeeded" && favoriteFestivals.length === 0 && (
        <p>No favorite festivals.</p>
      )}
      {status === "succeeded" && favoriteFestivals.length > 0 && (
        <ul className="list-disc pl-5">
          {favoriteFestivals.map((festival, idx) => (
            <li key={idx}>
              <strong>{festival.programName}</strong> - {festival.location}
            </li>
          ))}
        </ul>
      )}

      {/* Favorite Heritages */}
      <h2 className="text-xl font-semibold mt-4">Favorite Heritages</h2>
      {status === "succeeded" && favoriteHeritages.length === 0 && (
        <p>No favorite heritages.</p>
      )}
      {status === "succeeded" && favoriteHeritages.length > 0 && (
        <ul className="list-disc pl-5">
          {favoriteHeritages.map((heritage, idx) => (
            <li key={idx}>
              <strong>{heritage.ccbamnm1}</strong> - {heritage.ccbalcad}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalStorageViewer;
