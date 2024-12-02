import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define an async thunk to fetch event
export const fetchEvent = createAsyncThunk(
  "event/fetchEvent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/event"); // Adjust the URL to match your API
      return response.data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch events");
    }
  }
);

// Define the slice
const eventSlice = createSlice({
  name: "events",
  initialState: {
    event: [],
    loading: false,
    error: null,
  },
  reducers: {}, // Add synchronous reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
