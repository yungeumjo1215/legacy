import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch festival data
export const fetchFestivalData = createAsyncThunk(
  "festival/fetchFestivalData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/festival"); // API endpoint
      return response.data.data; // Directly return the raw data from the API response
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch festival data");
    }
  }
);

const festivalDetailSlice = createSlice({
  name: "festival",
  initialState: {
    festivalList: [], // Holds the raw data directly
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFestivalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFestivalData.fulfilled, (state, action) => {
        state.loading = false;
        state.festivalList = action.payload; // Store the raw data directly
      })
      .addCase(fetchFestivalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default festivalDetailSlice.reducer;
