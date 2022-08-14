import React from "react";
import { todoActions } from "../slice/todoSlice";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Box, Button, styled, Typography } from "@mui/material";

const StyledForm = styled(Form)(({ theme }) => ({
  width: "40%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  padding: "10px 20px",
  backgroundColor: "white",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledField = styled(Field, {
  shouldForwardProp: (props) => props !== "invalid",
})(
  ({ theme }) => ({
    width: "100%",
    marginBottom: "10px",
    fontSize: "16px",
    padding: "10px 5px",
    outline: "none",
    border: `1px solid ${theme.palette.primary.light}`,
  }),
  (prop) => ({
    border: prop.invalid && "1px solid red",
  })
);

const StyledErrorMessage = styled(ErrorMessage)({
  alignSelf: "flex-start",
  marginBottom: "10px",
  fontSize: "0.8rem",
  textAlign: "center",
  color: "red",
});

const TodoForm = () => {
  const { createTodo } = todoActions;
  const dispatch = useDispatch();

  const validateSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Todo phải có tối thiểu 2 ký tự")
      .max(30, "Todo không vượt quá 30 ký tự")
      .required("Vui lòng nhập todo"),
  });

  const onSubmit = async ({ name }, { resetForm }) => {
    try {
      let created = Math.floor(new Date().valueOf() / 1000);
      let finished = false;
      const docRef = await db.collection("todos").add({
        name,
        created,
        finished,
      });
      const newTodo = { id: docRef.id, name, finished, created };
      dispatch(createTodo(newTodo));
    } catch (error) {
      alert(error.message);
    }
    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ name: "" }}
      validationSchema={validateSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => {
        const { values, errors, touched } = formikProps;
        return (
          <StyledForm>
            <StyledField
              invalid={errors.name && touched.name}
              name="name"
              placeholder="Enter todo..."
            ></StyledField>
            <StyledErrorMessage
              component="div"
              name="name"
            ></StyledErrorMessage>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "primary.light",
                borderRadius: "5px",
                textTransform: "capitalize",
                "&::hover": { backgroundColor: "primary.main" },
              }}
            >
              Add
            </Button>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default TodoForm;
