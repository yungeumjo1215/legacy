import { createSlice } from "@reduxjs/toolkit";

// localStorage에서 초기 상태 불러오기
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

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: loadInitialState(),
  reducers: {
    addFavorite: (state, action) => {
      if (action.payload.type === "event") {
        state.festivals.push(action.payload);
        localStorage.setItem(
          "favoriteFestivals",
          JSON.stringify(state.festivals)
        );
      } else {
        state.heritages.push(action.payload);
        localStorage.setItem(
          "favoriteHeritages",
          JSON.stringify(state.heritages)
        );
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
