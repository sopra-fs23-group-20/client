import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "components/views/MainPage";
import PropTypes from "prop-types";
import React, { FC } from "react";
import Profile from "components/views/Profile";
import CountriesOverview from "components/views/CountriesOverview";
import GameLobby from "components/views/GameLobby";

interface GameRouterProps {
  base: string;
}

const GameRouter: FC<GameRouterProps> = ({ base }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route index element={<Navigate to={`${base}/dashboard`} />} />
        <Route path="dashboard" element={<MainPage />} />
        <Route path="profile/:userID" element={<Profile />} />
        <Route path="countries" element={<CountriesOverview />} />
        <Route path="lobby/:userID" element={<GameLobby />} />
      </Routes>
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string.isRequired,
};

export default GameRouter;
