import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  try {
    const savedHeritages = localStorage.getItem("favoriteHeritages");
    const savedFestivals = localStorage.getItem("favoriteFestivals");
    return {
      heritages: savedHeritages ? JSON.parse(savedHeritages) : [],
      festivals: savedFestivals ? JSON.parse(savedFestivals) : [],
    };
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
    return {
      heritages: [],
      festivals: [],
    };
  }
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("favoriteHeritages", JSON.stringify(state.heritages));
    localStorage.setItem("favoriteFestivals", JSON.stringify(state.festivals));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: loadInitialState(),
  reducers: {
    addFavorite: (state, action) => {
      const { type, ...itemData } = action.payload;

      if (type === "event") {
        const exists = state.festivals.some(
          (festival) => festival.programName === itemData.programName
        );
        if (!exists) {
          state.festivals.push(itemData);
          fetch("http://localhost:8000/pgdb/favoritelist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "event",
              data: itemData,
            }),
          }).catch((error) =>
            console.error("Error saving favorite to server:", error)
          );
        }
      } else {
        const exists = state.heritages.some(
          (heritage) => heritage.id === itemData.id
        );
        if (!exists) {
          state.heritages.push(itemData);
          fetch("http://localhost:8000/pgdb/favoritelist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "heritage",
              data: itemData,
            }),
          }).catch((error) =>
            console.error("Error saving favorite to server:", error)
          );
        }
      }
      saveToLocalStorage(state);
    },
    removeFavorite: (state, action) => {
      const { type, id } = action.payload;

      if (type === "event") {
        state.festivals = state.festivals.filter(
          (festival) => festival.programName !== id
        );
        fetch("http://localhost:8000/pgdb/favoritelist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "event",
            id: id,
          }),
        }).catch((error) =>
          console.error("Error removing favorite from server:", error)
        );
      } else {
        state.heritages = state.heritages.filter(
          (heritage) => heritage.id !== id
        );
        fetch("http://localhost:8000/pgdb/favoritelist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "heritage",
            id: id,
          }),
        }).catch((error) =>
          console.error("Error removing favorite from server:", error)
        );
      }
      saveToLocalStorage(state);
    },
    clearFavorites: (state) => {
      state.heritages = [];
      state.festivals = [];
      localStorage.removeItem("favoriteHeritages");
      localStorage.removeItem("favoriteFestivals");

      fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) =>
        console.error("Error clearing favorites from server:", error)
      );
    },
    fetchUserFavorites: (state, action) => {
      const { heritages, festivals } = action.payload;
      state.heritages = heritages || [];
      state.festivals = festivals || [];
      saveToLocalStorage(state);
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  fetchUserFavorites,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
