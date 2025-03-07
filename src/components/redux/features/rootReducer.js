import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice"; // Chỉ cần "./"
import userReducer from "./userSlice";  


export const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
});
