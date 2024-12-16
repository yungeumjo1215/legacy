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
        },
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data = await response.json();

      // Filter festivals and heritages based on fields
      const festivals = data.filter(
        (item) => item.programName && item.location
      );
      const heritages = data.filter((item) => item.ccbamnm1 && item.ccbalcad);

      return { festivals, heritages };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to add multiple favorites
export const addFavorites = createAsyncThunk(
  "favorites/addFavorites",
  async ({ token, newFavorites }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favoriteFestivals: newFavorites }),
      });

      if (!response.ok) throw new Error("Failed to add favorites");

      return Array.isArray(newFavorites) ? newFavorites : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to delete multiple favorites
export const deleteFavorites = createAsyncThunk(
  "favorites/deleteFavorites",
  async ({ token, favoritesToDelete }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/pgdb/favoritelist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ festivalsToDelete: favoritesToDelete }),
      });

      if (!response.ok) throw new Error("Failed to delete favorites");

      return Array.isArray(favoritesToDelete) ? favoritesToDelete : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favoriteFestivals: [], // Default empty array
    favoriteHeritages: [], // Default empty array
    status: "idle",
    error: null,
  },
  reducers: {
    addFavorite(state, action) {
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
    },
    removeFavorite(state, action) {
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
        fetch("http://localhost:8000/pgdb/favoritelist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "heritage",
            id: id,
          }),
        }).catch((error) =>
          console.error("Error removing favorite from server:", error)
        );
      }
    },
    clearFavorites(state) {
      state.favoriteFestivals = [];
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
        state.favoriteFestivals = festivals || [];
        state.favoriteHeritages = heritages || [];
        state.status = "succeeded";
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch favorites.";
      })
      .addCase(addFavorites.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.favoriteFestivals = [
            ...state.favoriteFestivals,
            ...action.payload,
          ];
        }
      })
      .addCase(deleteFavorites.fulfilled, (state, action) => {
        const favoritesToDelete = action.payload;

        if (Array.isArray(favoritesToDelete)) {
          state.favoriteFestivals = state.favoriteFestivals.filter(
            (fav) =>
              favoritesToDelete &&
              !favoritesToDelete.some(
                (item) =>
                  item.programName === fav.programName &&
                  item.location === fav.location
              )
          );
        }
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
