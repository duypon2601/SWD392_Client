// src/components/redux/features/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addProduct: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.foodId === newItem.foodId
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
  },
});

export const { addProduct } = cartSlice.actions;
export default cartSlice.reducer;