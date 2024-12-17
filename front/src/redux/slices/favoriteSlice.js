import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch favorites from the backend
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      console.log("Fetching favorites with token:", token);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch Response Status:", response.status);

      if (!response.ok) {
        console.error("Fetch failed with response:", response);
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      // Filter festivals and heritages based on fields
      const festivals = data.filter(
        (item) => item.programName && item.location
      );
      const heritages = data.filter((item) => item.ccbamnm1 && item.ccbalcad);

      console.log("Filtered Festivals:", festivals);
      console.log("Filtered Heritages:", heritages);

      return { festivals, heritages };
    } catch (err) {
      console.error("Error in fetchFavorites:", err.message);
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk to add multiple favorites
export const addFavorites = createAsyncThunk(
  "favorites/addFavorites",
  async ({ token, favoriteId, type }, { rejectWithValue }) => {
    try {
      console.log("Adding favorite with token:", token);
      console.log("Favorite ID:", favoriteId, "Type:", type);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: favoriteId, // Can be festivalid or heritageid
          type, // "event" or "heritage"
        }),
      });

      console.log("Add Response Status:", response.status);

      if (!response.ok) {
        console.error("Add failed with response:", response);
        throw new Error("Failed to add favorite");
      }

      const result = await response.json();
      console.log("Add Result:", result);

      return result;
    } catch (err) {
      console.error("Error in addFavorites:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to delete multiple favorites
export const deleteFavorites = createAsyncThunk(
  "favorites/deleteFavorites",
  async ({ token, favoriteId, type }, { rejectWithValue }) => {
    try {
      console.log("Deleting favorite with token:", token);
      console.log("Favorite ID:", favoriteId, "Type:", type);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: favoriteId, // Can be festivalid or heritageid
          type, // "event" or "heritage"
        }),
      });

      console.log("Delete Response Status:", response.status);

      if (!response.ok) {
        console.error("Delete failed with response:", response);
        throw new Error("Failed to delete favorite");
      }

      const result = await response.json();
      console.log("Delete Result:", result);

      return result;
    } catch (err) {
      console.error("Error in deleteFavorites:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Redux slice
const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    festivals: [],
    favoriteHeritages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addFavorite(state, action) {
      console.log("addFavorite Action:", action.payload);
      const { type, data } = action.payload;

      if (type === "festival") {
        // festivals 배열에 추가
        const isDuplicate = state.festivals.some(
          (festival) => festival.programName === data.programName
        );

        if (!isDuplicate) {
          state.festivals.push(data);
        }
      } else if (
        type === "heritage" &&
        Array.isArray(action.payload.favorites)
      ) {
        // heritage는 기존 로직 유지
        state.favoriteHeritages = [
          ...state.favoriteHeritages,
          ...action.payload.favorites.filter(
            (heritage) =>
              !state.favoriteHeritages.some((item) => item.id === heritage.id)
          ),
        ];
      }

      console.log("Updated favoriteFestivals:", state.festivals);
      console.log("Updated favoriteHeritages:", state.favoriteHeritages);
    },

    removeFavorite(state, action) {
      console.log("removeFavorite Action:", action.payload);
      const { type, programName } = action.payload;

      if (type === "festival") {
        state.festivals = state.festivals.filter(
          (festival) => festival.programName !== programName
        );
      } else if (
        type === "heritage" &&
        Array.isArray(action.payload.favoritesToRemove)
      ) {
        // heritage는 기존 로직 유지
        state.favoriteHeritages = state.favoriteHeritages.filter(
          (heritage) =>
            !action.payload.favoritesToRemove.some(
              (item) => item.id === heritage.id
            )
        );
      }

      console.log("Updated favoriteFestivals:", state.festivals);
      console.log("Updated favoriteHeritages:", state.favoriteHeritages);
    },
    clearFavorites(state) {
      console.log("Clearing all favorites...");
      state.festivals = [];
      state.favoriteHeritages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        console.log("fetchFavorites: Pending");
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        console.log("fetchFavorites: Fulfilled", action.payload);
        const { festivals, heritages } = action.payload;
        state.festivals = festivals || [];
        state.favoriteHeritages = heritages || [];
        state.status = "succeeded";
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        console.error("fetchFavorites: Rejected", action.payload);
        state.status = "failed";
        state.error = action.payload || "Failed to fetch favorites.";
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
