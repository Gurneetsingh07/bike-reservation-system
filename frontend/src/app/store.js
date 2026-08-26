import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});