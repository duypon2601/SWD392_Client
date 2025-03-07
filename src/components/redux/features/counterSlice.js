import { createSlice } from '@reduxjs/toolkit'; // ✅ Không import từ file khác

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Xuất reducers
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
