import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import chatGPTtheme from "styles/chatGPTtheme";
import { ThemeProvider } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(

    <ThemeProvider theme={chatGPTtheme}>
      <App />
    </ThemeProvider>

);
