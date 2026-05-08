import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { PenData } from "@/contexts/Types";

interface CartItem extends PenData {
  quantity: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const calculateTotalQuantity = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  totalQuantity: calculateTotalQuantity(loadCartFromLocalStorage()),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<PenData>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.basePrice;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.basePrice,
        });
      }

      state.totalQuantity++;
      saveCartToLocalStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      const existingItem = state.items.find((item) => item.id === idToRemove);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== idToRemove);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.basePrice;
        }
        state.totalQuantity--;
        saveCartToLocalStorage(state.items);
      }
    },

    deleteFromCart: (state, action: PayloadAction<string>) => {
      const itemToDelete = state.items.find(
        (item) => item.id === action.payload,
      );
      if (itemToDelete) {
        state.totalQuantity -= itemToDelete.quantity;
        state.items = state.items.filter((item) => item.id !== action.payload);
        saveCartToLocalStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      saveCartToLocalStorage(state.items);
    },
  },
});

export const CartActions = cartSlice.actions;
export const selectCartProducts = (state: RootState) => state.cart;
export default cartSlice.reducer;
