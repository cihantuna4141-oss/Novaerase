import { configureStore } from "@reduxjs/toolkit";
import FavoritesSlice from "./FavoritesSlice";
import CartSlice from "./CartSlice";
import { PenData } from "@/contexts/Types";

export const store = configureStore({
  reducer: {
    cart: CartSlice,
    favorites: FavoritesSlice,
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart.items);
  saveFavoritesToLocalStorage(state.favorites.items);
});

function saveCartToLocalStorage(cart: PenData[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function saveFavoritesToLocalStorage(favorites: PenData[]) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;