import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch festival data
export const fetchFestivalData = createAsyncThunk(
  "festival/fetchFestivalData",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/festival", {
        params: { year, month },
      });

      // 응답 데이터 구조 확인 및 변환

      if (response.data && response.data.data) {
        // 데이터 구조 정규화
        return response.data.data.map((item) => ({
          programName: item.programName || item.subTitle,
          programContent: item.programContent || item.subContent,
          startDate: item.startDate || item.sDate,
          endDate: item.endDate || item.eDate,
          location: item.location || item.subDesc,
          contact: item.contact,
          sido: item.sido,
          image: item.image || item.fileNm,
          targetAudience: item.targetAudience || item.subDesc1,
          additionalInfo:
            item.additionalInfo ||
            `${item.subDesc2 || ""}, ${item.subDesc_3 || ""}`,
        }));
      }
      return [];
    } catch (error) {
      console.error("API Fetch Error:", error);
      return rejectWithValue(error.message || "Failed to fetch festival data");
    }
  }
);

const festivalDetailSlice = createSlice({
  name: "festival",
  initialState: {
    festivalList: [],
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
        state.festivalList = action.payload;
      })
      .addCase(fetchFestivalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.festivalList = [];
      });
  },
});

export default festivalDetailSlice.reducer;
