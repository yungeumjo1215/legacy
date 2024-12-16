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
  async ({ token, newFavorites }, { rejectWithValue }) => {
    try {
      console.log("Adding favorites with token:", token);
      console.log("New Favorites Payload:", newFavorites);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favoriteFestivals: newFavorites }),
      });

      console.log("Add Response Status:", response.status);

      if (!response.ok) {
        console.error("Add failed with response:", response);
        throw new Error("Failed to add favorites");
      }

      const result = await response.json();
      console.log("Add Result:", result);

      return Array.isArray(newFavorites) ? newFavorites : [];
    } catch (err) {
      console.error("Error in addFavorites:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to delete multiple favorites
export const deleteFavorites = createAsyncThunk(
  "favorites/deleteFavorites",
  async ({ token, favoritesToDelete }, { rejectWithValue }) => {
    try {
      console.log("Deleting favorites with token:", token);
      console.log("Favorites to Delete:", favoritesToDelete);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ festivalsToDelete: favoritesToDelete }),
      });

      console.log("Delete Response Status:", response.status);

      if (!response.ok) {
        console.error("Delete failed with response:", response);
        throw new Error("Failed to delete favorites");
      }

      const result = await response.json();
      console.log("Delete Result:", result);

      return Array.isArray(favoritesToDelete) ? favoritesToDelete : [];
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
    favoriteFestivals: [],
    favoriteHeritages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addFavorite(state, action) {
      console.log("addFavorite Action:", action.payload);

      const { favorites, type } = action.payload;

      if (type === "festival" && Array.isArray(favorites)) {
        state.favoriteFestivals = [
          ...state.favoriteFestivals,
          ...favorites.filter(
            (fav) =>
              state.favoriteFestivals &&
              !state.favoriteFestivals.some(
                (item) =>
                  item.programName === fav.programName &&
                  item.location === fav.location
              )
          ),
        ];
      } else if (type === "heritage" && Array.isArray(favorites)) {
        state.favoriteHeritages = [
          ...state.favoriteHeritages,
          ...favorites.filter(
            (heritage) =>
              state.favoriteHeritages &&
              !state.favoriteHeritages.some((item) => item.id === heritage.id)
          ),
        ];
      }

      console.log("Updated favoriteFestivals:", state.favoriteFestivals);
      console.log("Updated favoriteHeritages:", state.favoriteHeritages);
    },
    removeFavorite(state, action) {
      console.log("removeFavorite Action:", action.payload);

      const { favoritesToRemove, type } = action.payload;

      if (type === "festival" && Array.isArray(favoritesToRemove)) {
        state.favoriteFestivals = state.favoriteFestivals.filter(
          (fav) =>
            favoritesToRemove &&
            !favoritesToRemove.some(
              (item) =>
                item.programName === fav.programName &&
                item.location === fav.location
            )
        );
      } else if (type === "heritage" && Array.isArray(favoritesToRemove)) {
        state.favoriteHeritages = state.favoriteHeritages.filter(
          (heritage) =>
            favoritesToRemove &&
            !favoritesToRemove.some((item) => item.id === heritage.id)
        );
      }

      console.log("Updated favoriteFestivals:", state.favoriteFestivals);
      console.log("Updated favoriteHeritages:", state.favoriteHeritages);
    },
    clearFavorites(state) {
      console.log("Clearing all favorites...");
      state.favoriteFestivals = [];
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
        state.favoriteFestivals = festivals || [];
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
