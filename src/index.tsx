import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AlertProvider } from "./helpers/AlertContext";
const root = document.getElementById("root");

ReactDOM.render(
  <AlertProvider>
    <App />
  </AlertProvider>,
  root
);
