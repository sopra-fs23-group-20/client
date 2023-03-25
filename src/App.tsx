import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import React from "react";
import {
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  adaptV4Theme,
} from "@mui/material";
import darkTheme from "styles/darkTheme";
import lightTheme from "styles/lightTheme";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        <AppRouter />
      </Box>
    </>
  );
};

export default App;
