import { createSlice } from "@reduxjs/toolkit";

// Helper function to send data to the backend
const sendDataToBackend = async (payload) => {
  try {
    const response = await fetch("http://localhost:8000/api/store-favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Data successfully sent to backend:", result);
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
};

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
    syncFavoritesToBackend: (state) => {
      const payload = {
        favoriteFestivals: state.festivals,
        favoriteHeritages: state.heritages,
      };
      sendDataToBackend(payload);
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  fetchUserFavorites,
  syncFavoritesToBackend,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
