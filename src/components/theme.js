import { createTheme } from "@mui/material";
export const theme = createTheme({
  palette: {
    primary: {
      main: "#5c5cf5",
      light: "#cbcbf3",
    },
    background: {
      default: "#cbcbf3",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: "10px",
          padding: 0,
        },
      },
    },
  },
});
