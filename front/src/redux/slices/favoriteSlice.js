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

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      // 서버 응답이 배열이 아닌 경우 빈 배열로 초기화
      const festivals = Array.isArray(data) ? data : [];
      const heritages = []; // heritage 데이터는 현재 사용하지 않음

      console.log("Processed Festivals:", festivals);
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
        const isDuplicate = state.festivals.some(
          (festival) => festival.festivalid === data.festivalid
        );

        if (!isDuplicate) {
          const formattedFestival = {
            ...data,
            festivalid: data.festivalid || data.id, // festivalid 또는 id 사용
            id: data.festivalid || data.id,
            imageUrl: data.image || data.imageUrl, // image 또는 imageUrl 사용
            programName: data.programName,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            contact: data.contact,
          };
          state.festivals.push(formattedFestival);
        }
      }
    },

    removeFavorite(state, action) {
      console.log("removeFavorite Action:", action.payload);
      const { type, id } = action.payload;

      if (type === "festival") {
        state.festivals = state.festivals.filter(
          (festival) => festival.festivalid !== id
        );
      } else if (type === "heritage") {
        state.favoriteHeritages = state.favoriteHeritages.filter(
          (heritage) => heritage.heritageid !== id
        );
      }
    },

    clearFavorites(state) {
      state.festivals = [];
      state.favoriteHeritages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        const { festivals, heritages } = action.payload;
        state.festivals = festivals;
        state.favoriteHeritages = heritages;
        state.status = "succeeded";
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch favorites.";
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
