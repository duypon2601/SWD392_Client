import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []  // Đặt mảng của bạn trong một đối tượng
  },
  reducers: {
    addProduct: (state, action) => {
      // kiểm tra sản phẩm có trong mảng redux của mình chưa
      const product = action.payload;
      const existingProduct = state.items.find((item) => item.food_id === product.food_id);

      // trường hợp nếu có thì tăng quantity lên 
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        // trường hợp không có thì thêm vào mảng và thêm quantity
        state.items.push({ ...product, quantity: 1 });
      }
    },
    clearAll: (state) => {
      state.items = [];
    },
  }
});

export const { addProduct, clearAll } = cartSlice.actions;
export default cartSlice.reducer;