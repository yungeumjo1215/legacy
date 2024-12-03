import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  heritages: [],
  festivals: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (action.payload.type === "event") {
        const exists = state.festivals.some(
          (festival) => festival.programName === action.payload.programName
        );
        if (!exists) {
          state.festivals.push(action.payload);
          localStorage.setItem(
            "favoriteFestivals",
            JSON.stringify(state.festivals)
          );
        }
      } else {
        const exists = state.heritages.some(
          (heritage) => heritage.id === action.payload.id
        );
        if (!exists) {
          state.heritages.push(action.payload);
          localStorage.setItem(
            "favoriteHeritages",
            JSON.stringify(state.heritages)
          );
        }
      }
    },
    removeFavorite: (state, action) => {
      if (action.payload.type === "event") {
        state.festivals = state.festivals.filter(
          (festival) => festival.programName !== action.payload.programName
        );
        localStorage.setItem(
          "favoriteFestivals",
          JSON.stringify(state.festivals)
        );
      } else {
        state.heritages = state.heritages.filter(
          (heritage) => heritage.id !== action.payload.id
        );
        localStorage.setItem(
          "favoriteHeritages",
          JSON.stringify(state.heritages)
        );
      }
    },
    clearFavorites: (state) => {
      state.heritages = [];
      state.festivals = [];
      localStorage.removeItem("favoriteHeritages");
      localStorage.removeItem("favoriteFestivals");
    },
    fetchUserFavorites: (state, action) => {
      const { heritages, festivals } = action.payload;
      state.heritages = heritages || [];
      state.festivals = festivals || [];
      localStorage.setItem(
        "favoriteHeritages",
        JSON.stringify(state.heritages)
      );
      localStorage.setItem(
        "favoriteFestivals",
        JSON.stringify(state.festivals)
      );
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
