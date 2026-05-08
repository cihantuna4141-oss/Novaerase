import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { ProductsData } from "@/contexts/Types";

interface CartItem extends ProductsData {
  quantity: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

// ===== load Cart From LocalStorage ====
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

// ===== Save Cart To LocalStorage =====
const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ==== calculate To talQuantity ====
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
    // ==== Add to Cart ====
    addToCart: (state, action: PayloadAction<ProductsData>) => {
      const newItem = action.payload;

      // Ensure newItem.price is a number, default to 0 if it's not
      const newItemPrice =
        typeof newItem.price === "number" ? newItem.price : 0;

      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItemPrice;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItemPrice,
        });
      }

      state.totalQuantity++;
      saveCartToLocalStorage(state.items);
    },

    // ===== Remove from Cart ====
    removeFromCart: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      const existingItem = state.items.find((item) => item.id === idToRemove);

      if (existingItem) {
        //Ensure the existingItem.price is a number, default to 0 if not
        const existingItemPrice =
          typeof existingItem.price === "number" ? existingItem.price : 0;

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== idToRemove);
          state.totalQuantity--;
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItemPrice;
        }
        saveCartToLocalStorage(state.items);
      }
    },

    // ==== Delete From Cart =====
    deleteFromCart: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      const itemToDelete = state.items.find((item) => item.id === idToDelete);

      if (itemToDelete) {
        state.totalQuantity -= itemToDelete.quantity;
        state.items = state.items.filter((item) => item.id !== idToDelete);
        saveCartToLocalStorage(state.items);
      }
    },

    // ==== Clear Cart ====
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
