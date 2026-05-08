import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { PenData } from "@/contexts/Types";

interface FavoritesState {
  items: PenData[];
}

// Helpers for LocalStorage
const loadFavoritesFromLocalStorage = (): PenData[] => {
  if (typeof window === "undefined") return [];
  const storedFavorites = localStorage.getItem("favorites");
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

const saveFavoritesToLocalStorage = (favorites: PenData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

const initialState: FavoritesState = {
  items: loadFavoritesFromLocalStorage(),
};

const FavoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorite: (state, action: PayloadAction<PenData>) => {
      const newItem = action.payload;
      const exists = state.items.some((item) => item.id === newItem.id);

      if (!exists) {
        state.items.push(newItem); // No 'quantity: 1' here to avoid TS error
        saveFavoritesToLocalStorage(state.items);
      }
    },

    deleteFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveFavoritesToLocalStorage(state.items);
    },

    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToLocalStorage(state.items);
    },
  },
});

export const FavoriteActions = FavoritesSlice.actions;
export const selectFavoriteItems = (state: RootState) => state.favorites.items;
export default FavoritesSlice.reducer;