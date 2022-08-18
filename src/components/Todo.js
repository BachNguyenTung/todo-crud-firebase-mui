import React from "react";
import { todoActions } from "../slice/todoSlice";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Box, ButtonGroup, IconButton, styled, InputBase } from "@mui/material";
import {
  Delete,
  Edit,
  Done,
  CheckCircleOutlined,
  CircleOutlined,
} from "@mui/icons-material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "none !important",
  borderRadius: 0,
  backgroundColor: "white",
  "&:hover": { backgroundColor: theme.palette.primary.light },
  "&:disabled": { backgroundColor: "gray" },
  [theme.breakpoints.down("sm")]: {
    flex: 1,
  },
}));

const Todo = ({ item }) => {
  console.log("todo render");
  const { updateTodo, deleteTodo } = todoActions;
  const [isDisabled, setIsDisabled] = useState(true);
  const dispatch = useDispatch();
  let cbRef;

  const [newName, setNewName] = useState(item.name);
  const handleChange = (e) => {
    e.preventDefault();
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
    cbRef.focus();
  };

  const callbackRef = (element) => {
    if (element) {
      cbRef = element;
    }
  };

  return (
    <Box
      bgcolor="white"
      mt={1}
      mb={1}
      sx={(theme) => ({
        padding: "10px 20px",
        borderRadius: "5px",
        width: "60%",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          flexDirection: "column",
        },
      })}
      display="flex"
      justifyContent="center"
    >
      <InputBase
        inputRef={callbackRef}
        // disabled={isDisabled}
        readOnly={isDisabled}
        name="todo"
        type="text"
        value={newName}
        onChange={handleChange}
        sx={{
          flex: "1",
          fontSize: "20px",
          textDecoration: item.finished && "line-through",
          border: "none",
          //styled disabled input
          // "& .MuiInputBase-input.Mui-disabled": {
          //   WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
          // },
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
