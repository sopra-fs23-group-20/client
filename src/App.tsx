import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  adaptV4Theme,
} from "@mui/material";
import darkTheme from "styles/darkTheme";
import lightTheme from "styles/lightTheme";
import { WebSocketProvider } from "helpers/WebSocketContext";
import { SocketIOProvider } from "helpers/SocketIOContext";

const App = () => {
  const [token, setToken] = useState<string | null>(null);

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
        <SocketIOProvider token={token}>
          <AppRouter onTokenChange={setToken} />
        </SocketIOProvider>
      </Box>
    </>
  );
};

export default App;
