import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice"; // Chỉ cần "./"
import userReducer from "./userSlice";  
import cartReducer from "./cartSlice";
import notificationReducer from './notificationSlice';

export const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  cart: cartReducer,
  notifications: notificationReducer,
});
