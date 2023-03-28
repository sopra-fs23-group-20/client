import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import GameState from "models/GameState";

interface Props {
  gameId: string | undefined;
  setGameState: (gameState: GameState | null) => void;
}

const NotJoinedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const setGameState = props.setGameState;
  function convertToGameStateEnum(type: string): GameState | null {
    switch (type) {
      case "SETUP":
        return GameState.SETUP;
      case "GUESSING":
        return GameState.GUESSING;
      case "SCOREBOARD":
        return GameState.SCOREBOARD;
      case "Ended":
        return GameState.ENDED;
      default:
        console.error(`Invalid GameState string received: ${type}`);
        return null;
    }
  }

  async function joinGame(): Promise<void> {
    try {
      const userId = localStorage.getItem("userId");

      if (userId) {
        const gameId = props.gameId;
        const response = await api.post(`/games/${gameId}/join`, {
          userId: userId,
        });
        setGameState(convertToGameStateEnum(response.data.currentState));
      }
    } catch (error) {
      alert("Could not join the lobby");
      console.error(error);
      navigate("/game");
    }
  }

  return (
    <Container>
      <Typography variant="h2">You have not yet joined the Game!</Typography>
      <Button variant="outlined" onClick={() => joinGame()}>
        Press to Join the Game
      </Button>
    </Container>
  );
};
export default NotJoinedComponent;
