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
import HintContainer from "../HintContainer";
import GameState from "models/constant/GameState";

interface Props {
  gameId: string | undefined;
}

const NotJoinedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();

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

  return (
    <Container>
      <Typography variant="h2">You have not yet joined the Game!</Typography>
    </Container>
  );
};
export default NotJoinedComponent;
