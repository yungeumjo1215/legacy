import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch heritage data
export const fetchHeritageData = createAsyncThunk(
  "heritage/fetchHeritageData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/pgdb/heritage");
      return response.data; // Directly return the API response
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch heritage data");
    }
  }
);

const detailSlice = createSlice({
  name: "heritage",
  initialState: {
    heritageList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeritageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeritageData.fulfilled, (state, action) => {
        state.loading = false;
        state.heritageList = action.payload; // Save the data in state
      })
      .addCase(fetchHeritageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default detailSlice.reducer;
