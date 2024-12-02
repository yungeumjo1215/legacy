import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8000/favorites/${userId}`
    );
    return response.data;
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ userId, eventName, eventType }) => {
    const response = await axios.post("http://localhost:8000/favorites", {
      userId,
      eventName,
      eventType,
    });
    return response.data;
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async ({ userId, eventName }) => {
    await axios.delete(
      `http://localhost:8000/favorites/${userId}/${eventName}`
    );
    return eventName;
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.event_name !== action.payload
        );
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
