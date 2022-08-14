import { configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "./slice/todoSlice";

const rootReducer = {
  todo: todoReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export { store };
