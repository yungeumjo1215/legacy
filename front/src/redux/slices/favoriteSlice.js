import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return { heritages: [], festivals: [] };

    const favoriteHeritages = localStorage.getItem("favoriteHeritages");
    const favoriteFestivals = localStorage.getItem("favoriteFestivals");

    return {
      heritages: favoriteHeritages ? JSON.parse(favoriteHeritages) : [],
      festivals: favoriteFestivals ? JSON.parse(favoriteFestivals) : [],
    };
  } catch (error) {
    console.error("즐겨찾기 데이터 로드 실패:", error);
    return { heritages: [], festivals: [] };
  }
};

const initialState = loadInitialState();

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (action.payload.type === "event") {
        if (
          !state.festivals.some(
            (festival) => festival.programName === action.payload.programName
          )
        ) {
          const festivalData = { ...action.payload };
          delete festivalData.type;
          state.festivals.push(festivalData);
          localStorage.setItem(
            "favoriteFestivals",
            JSON.stringify(state.festivals)
          );
        }
      } else {
        if (
          !state.heritages.some(
            (heritage) => heritage.ccbaKdcd === action.payload.ccbaKdcd
          )
        ) {
          const heritageData = { ...action.payload };
          delete heritageData.type;
          state.heritages.push(heritageData);
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
          (heritage) => heritage.ccbaKdcd !== action.payload.ccbaKdcd
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
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
