import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";

export const fetchTodo = createAsyncThunk("todo/fetchTodo", () => {
  return db
    .collection("todos")
    .orderBy("created", "desc")
    .get()
    .then((querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      return todosArray;
    });
});

// TODO: createAsyncThunk for create, update, delete, finished

const initialState = {
  loading: false,
  items: [],
  error: "",
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    createTodo: (state, action) => {
      state.items = [...state.items, action.payload];
      // state.items.push(action.payload);
      state.items.sort((a, b) => b.created - a.created);
    },
    updateTodo: (state, action) => {
      const { id, newName, finished } = action.payload;
      let item = state.items.find((item) => item.id === id);
      if (item && newName && newName !== item.name) {
        item.name = newName;
        item.finished = false;
      }
      if (item && typeof finished !== "undefined") {
        item.finished = finished;
      }
    },
    deleteTodo: (state, action) => {
      state.items = [...state.items].filter(
        (item) => item.id !== action.payload
      );
    },
  },
  extraReducers: {
    [fetchTodo.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchTodo.fulfilled]: (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = "";
    },
    [fetchTodo.rejected]: (state, action) => {
      state.loading = false;
      state.items = [];
      state.error = action.error.message;
    },
  },
});

export const todoReducer = todoSlice.reducer;
export const todoActions = todoSlice.actions;
