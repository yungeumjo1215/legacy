import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch favorites from the backend
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      // console.log("Fetching favorites with token:", token);

      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response error:", errorData);
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Raw server response:", data);

      if (!data) {
        console.error("No data received from server");
        return { festivals: [], heritages: [] };
      }

      // 서버 응답에서 festivals 배열 추출
      const festivals = data.festivals
        ? data.festivals.map((festival) => {
            // console.log("Processing festival item:", festival);
            return {
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
            };
          })
        : [];

      // console.log("Processed festivals:", festivals);
      const heritages = data.heritages || [];

      return { festivals, heritages };
    } catch (err) {
      console.error("Error in fetchFavorites:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
      });
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
            festivalid: data.festivalid || data.id,
            id: data.festivalid || data.id,
            imageUrl: data.image || data.imageUrl,
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
        // console.log("Fetching favorites...");
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        // console.log("Previous state:", state.festivals);
        // console.log("Action payload received:", action.payload);

        if (action.payload && action.payload.festivals) {
          state.festivals = action.payload.festivals.map((festival) => ({
            ...festival,
            festivalid: festival.festivalid || festival.id,
            id: festival.festivalid || festival.id,
            imageUrl: festival.image || festival.imageUrl,
            programName: festival.programName,
            location: festival.location,
            startDate: festival.startDate,
            endDate: festival.endDate,
            contact: festival.contact,
          }));
        } else {
          state.festivals = [];
        }

        state.favoriteHeritages = action.payload?.heritages || [];
        state.status = "succeeded";

        // console.log("Updated state:", state.festivals);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch favorites.";
        console.error("Fetch favorites failed:", action.payload);
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
