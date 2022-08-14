import React from "react";
import { fetchTodo } from "../slice/todoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Todo from "./Todo";

const TodoList = () => {
  const { items, loading, error } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return items.map((item) => <Todo key={item.id} item={item}></Todo>);
};

export default TodoList;
