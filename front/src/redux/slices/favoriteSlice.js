import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    heritages: [],
    festivals: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      if (action.payload.type === "event") {
        state.festivals.push(action.payload);
      } else {
        state.heritages.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      if (action.payload.type === "event") {
        state.festivals = state.festivals.filter(
          (festival) => festival.programName !== action.payload.programName
        );
      } else {
        state.heritages = state.heritages.filter(
          (heritage) => heritage.id !== action.payload.id
        );
      }
    },
    clearFavorites: (state) => {
      state.heritages = [];
      state.festivals = [];
    },
    fetchUserFavorites: (state, action) => {
      const { heritages, festivals } = action.payload;
      state.heritages = heritages || [];
      state.festivals = festivals || [];
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
