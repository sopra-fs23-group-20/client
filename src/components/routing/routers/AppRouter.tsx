import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Landing from "components/views/Landing";
import landingTheme from "styles/landingTheme";

import React, { FC } from "react";
import { ThemeProvider } from "@mui/material";

interface AppRouterProps {
  onTokenChange: (token: string | null) => void;
}

const AppRouter: FC<AppRouterProps> = ({ onTokenChange }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/game/*"
          element={
            <GameGuard>
              <GameRouter base="/game" onTokenChange={onTokenChange} />
            </GameGuard>
          }
        />
        <Route
          path="/login"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />
        <Route
          path="/landing"
          element={
            <LoginGuard>
              <Landing />
            </LoginGuard>
          }
        />
        <Route
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />
        <Route path="/" element={<Navigate to="/landing" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
