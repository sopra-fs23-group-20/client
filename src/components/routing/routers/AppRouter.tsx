import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import React from "react";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/game/*"
          element={
            <GameGuard>
              <GameRouter base="/game" />
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
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />
        <Route path="/" element={<Navigate to="/game" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
