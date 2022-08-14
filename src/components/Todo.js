import React, { useCallback, useRef } from "react";
import { todoActions } from "../slice/todoSlice";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputBase,
  styled,
  TextField,
} from "@mui/material";
import {
  TaskAlt,
  Add,
  Delete,
  Edit,
  Done,
  CheckCircleOutlined,
  CircleOutlined,
} from "@mui/icons-material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "none !important",
  width: "4rem",
  height: "4rem",
  borderRadius: 0,
  backgroundColor: "white",
  "&:hover": { backgroundColor: theme.palette.primary.light },
  "&:disabled": { backgroundColor: "gray" },
}));

const Todo = ({ item }) => {
  const { updateTodo, deleteTodo } = todoActions;
  const [isDisabled, setIsDisabled] = useState(true);
  const dispatch = useDispatch();

  const [newName, setNewName] = useState(item.name);
  const handleChange = (e) => {
    e.preventDefault();
    console.log(e);
    setNewName(e.target.value);
    dispatch(updateTodo({ id: item.id, finished: false })); // set finishedfalse if edit attempts
  };

  const handleApply = async () => {
    const docRef = db.collection("todos").doc(item.id);
    try {
      await docRef.update({ name: newName, finished: item.finished });
    } catch (error) {
      alert(error.message);
    }
    dispatch(updateTodo({ id: item.id, newName }));
    setIsDisabled(!isDisabled);
  };

  const handleDelete = async () => {
    const docRef = db.collection("todos").doc(item.id);
    try {
      await docRef.delete();
    } catch (err) {
      alert(err.message);
    }
    dispatch(deleteTodo(item.id));
  };

  const handleFinished = async () => {
    const docRef = db.collection("todos").doc(item.id);
    try {
      await docRef.update({ finished: !item.finished });
    } catch (error) {
      alert(error.message);
    }
    dispatch(updateTodo({ id: item.id, finished: !item.finished }));
  };

  const handleEdit = () => {
    setIsDisabled(!isDisabled);
  };

  const callbackRef = (element) => {
    // cbRef = element;
    if (element) {
      element.focus();
    }
  };

  return (
    <Box
      bgcolor="white"
      p={1}
      mt={1}
      mb={1}
      sx={{
        borderRadius: "5px",
      }}
      width="50%"
      display="flex"
      justifyContent="center"
    >
      <InputBase
        inputRef={callbackRef}
        disabled={isDisabled}
        name="todo"
        type="text"
        value={newName}
        onChange={handleChange}
        sx={{
          border: !isDisabled && "1px solid black",
          flex: "1",
          fontSize: "20px",
          textDecoration: item.finished && "line-through",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          },
        }}
      />
      <ButtonGroup
        sx={{ borderRadius: 0 }}
        color="secondary"
        aria-label="button group"
      >
        <StyledIconButton
          sx={{ color: "#54cffd" }}
          onClick={isDisabled ? handleEdit : handleApply}
        >
          {isDisabled ? (
            <Edit sx={{ fontSize: "2rem" }} />
          ) : (
            <Done sx={{ fontSize: "2rem" }} />
          )}
        </StyledIconButton>
        <StyledIconButton sx={{ color: "#94faa5" }} onClick={handleFinished}>
          {item.finished ? (
            <CheckCircleOutlined sx={{ fontSize: "2rem" }} />
          ) : (
            <CircleOutlined sx={{ fontSize: "2rem" }} />
          )}
        </StyledIconButton>
        <StyledIconButton onClick={handleDelete}>
          <Delete sx={{ color: "red", fontSize: "2rem" }} />
        </StyledIconButton>
      </ButtonGroup>
    </Box>
  );
};

export default Todo;
