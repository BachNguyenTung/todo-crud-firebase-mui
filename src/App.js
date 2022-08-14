import { Box, Stack } from "@mui/material";
import Title from "./components/Title";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
function App() {
  return (
    <Box>
      <Stack alignItems="center" textAlign="center">
        <Title></Title>
        <TodoForm></TodoForm>
        <TodoList></TodoList>
      </Stack>
    </Box>
  );
}

export default App;
