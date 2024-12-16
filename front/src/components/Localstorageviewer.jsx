import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFavorites,
  addFavorites,
  deleteFavorites,
} from "../redux/slices/favoriteSlice";
import { loginSuccess } from "../redux/slices/authSlice";

const LocalStorageViewer = () => {
  const dispatch = useDispatch();

  // Access Redux state
  const {
    favoriteFestivals = [],
    favoriteHeritages = [],
    status,
    error,
  } = useSelector((state) => state.favorites);
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // Handle token-based login and fetch favorites
  useEffect(() => {
    if (token && !isLoggedIn) {
      const user = JSON.parse(localStorage.getItem("user"));
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
      dispatch(fetchFavorites(token));
    }
  }, [dispatch, token, isLoggedIn]);

  // Handler to add a favorite (example: festival)
  const handleAddFavorite = (id, type) => {
    dispatch(addFavorites({ token, favoriteId: id, type }));
  };

  // Handler to delete a favorite (example: heritage)
  const handleDeleteFavorite = (id, type) => {
    dispatch(deleteFavorites({ token, favoriteId: id, type }));
  };

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
            <li key={idx} className="flex justify-between items-center">
              <div>
                <strong>{festival.programName}</strong> - {festival.location}
              </div>
              <button
                onClick={() => handleDeleteFavorite(festival.id, "event")}
                className="text-red-500 hover:underline">
                Remove
              </button>
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
            <li key={idx} className="flex justify-between items-center">
              <div>
                <strong>{heritage.ccbamnm1}</strong> - {heritage.ccbalcad}
              </div>
              <button
                onClick={() => handleDeleteFavorite(heritage.id, "heritage")}
                className="text-red-500 hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalStorageViewer;
