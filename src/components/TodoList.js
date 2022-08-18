import React from "react";
import { fetchTodo } from "../slice/todoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Todo from "./Todo";
import { Box } from "@mui/material";

const TodoList = () => {
  const { items, loading, error } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  if (loading) {
    return (
      <Box component={"h1"} color="red" p={10} textAlign="center">
        Loading...
      </Box>
    );
  }
  if (error) {
    return <Box>{error.message}</Box>;
  }
  return items.map((item) => <Todo key={item.id} item={item}></Todo>);
};

export default TodoList;
