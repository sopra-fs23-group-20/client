import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";

import currentUsedTheme from "styles/currentUsedTheme";

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <ThemeProvider theme={currentUsedTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          background: currentUsedTheme.palette.background.default,
        }}
      >
        <AppRouter onTokenChange={setToken} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
