import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";

export const fetchTodo = createAsyncThunk("todo/fetchTodo", async () => {
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

// TODO: createAsyncThunk for create, delete, finished
// * Show how data is updated and retreived from firebase with loading time
// * Can update data to firebase and update data to local state seperately
export const updateTodoThunk = createAsyncThunk(
  "todo/updateTodoThunk",
  async ({ id, name, finished, created }) => {
    return db
      .collection("todos")
      .doc(id)
      .update({ name, finished, created })
      .then(() => ({
        id,
        name,
        finished,
        created,
      }))
      .catch((err) => err);
  }
);

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
      state.items = [...state.items].sort((a, b) => b.created - a.created);
    },
    updateTodo: (state, action) => {
      const { id, finished } = action.payload;
      let item = state.items.find((item) => item.id === id);
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
    [updateTodoThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTodoThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = "";
      const { id, name, created } = action.payload;
      let item = state.items.find((item) => item.id === id);
      if (item && name && name !== item.name) {
        item.name = name;
        item.finished = false;
        item.created = created;
      }
      // state.items[action.payload.i] = action.payload;
    },
    [updateTodoThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const todoReducer = todoSlice.reducer;
export const todoActions = todoSlice.actions;
