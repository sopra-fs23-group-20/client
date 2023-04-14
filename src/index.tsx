import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import currentUsedTheme from "styles/currentUsedTheme";
import { ThemeProvider } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ThemeProvider theme={currentUsedTheme}>
    <App />
  </ThemeProvider>
);
