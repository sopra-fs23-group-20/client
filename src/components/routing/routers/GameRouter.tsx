import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "components/views/MainPage";
import PropTypes from "prop-types";
import React, { FC } from "react";
import Profile from "components/views/Profile";
import CountriesOverview from "components/views/CountriesOverview";
import GameLobby from "components/views/GameLobby";
import GameLobbyOverview from "components/views/GameLobbyOverview";
import SetupComponent from "components/ui/GameComponents/SetupComponent";
import GameCreationComponent from "components/ui/GameComponents/GameCreationComponent";

interface GameRouterProps {
  base: string;
  onTokenChange: (token: string | null) => void;
}

const GameRouter: FC<GameRouterProps> = ({ base, onTokenChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route index element={<Navigate to={`${base}/dashboard`} />} />
        <Route
          path="dashboard"
          element={<MainPage onTokenChange={onTokenChange} />}
        />
        <Route path="profile/:userID" element={<Profile />} />
        <Route path="countries" element={<CountriesOverview />} />
        <Route
          path="lobbyCreation/:gameID"
          element={<GameCreationComponent gameId={undefined} />}
        />
        <Route path="lobby/:gameID" element={<GameLobby />} />
        <Route path="lobbies" element={<GameLobbyOverview />} />
      </Routes>
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string.isRequired,
};

export default GameRouter;
