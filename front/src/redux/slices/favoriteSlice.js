import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch favorites from the backend
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();

      if (!data) {
        return { festivals: [], heritages: [] };
      }

      // 서버 응답에서 festivals 배열 추출
      const festivals = data.festivals
        ? data.festivals.map((festival) => ({
            ...festival,
            festivalid: festival.festivalid,
            id: festival.festivalid,
            imageUrl: festival.festivalimageurl,
            programName: festival.festivalname,
            location: festival.festivallocation,
            startDate: festival.festivalstartdate,
            endDate: festival.festivalenddate,
            contact: festival.festivalcontact,
            programContent: festival.festivalcontent,
            targetAudience: festival.festivaltargetaudience,
          }))
        : [];

      const heritages = data.heritages || [];

      return { festivals, heritages };
    } catch (err) {
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
    heritages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // 즐겨찾기 상태 초기화 액션
    setFavorites(state, action) {
      const { heritages, festivals } = action.payload;
      state.heritages = heritages || [];
      state.festivals = festivals || [];
    },

    addFavorite(state, action) {
      const { type, data } = action.payload;
      if (type === "heritage") {
        if (!state.heritages.some((h) => h.heritageid === data.heritageid)) {
          state.heritages.push(data);
        }
      } else if (type === "festival") {
        if (!state.festivals.some((f) => f.festivalid === data.festivalid)) {
          state.festivals.push(data);
        }
      }
    },

    removeFavorite(state, action) {
      const { type, id } = action.payload;
      if (type === "heritage") {
        state.heritages = state.heritages.filter((h) => h.heritageid !== id);
      } else if (type === "festival") {
        state.festivals = state.festivals.filter((f) => f.festivalid !== id);
      }
    },

    addToList: (state, action) => {
      state.festivals.push(action.payload);
    },
    removeFromList: (state, action) => {
      state.festivals = state.festivals.filter(
        (festival) => festival.festivalid !== action.payload
      );
    },
  },
});

export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  addToList,
  removeFromList,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
