import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";

interface Props {
  gameId: string | undefined;
}
const SetupComponent: React.FC<Props> = (props) => {
  const gameId = props.gameId;

  async function startGame(): Promise<void> {
    try {
      await api.put(`/games/${gameId}/start`);
    } catch (error: AxiosError | any) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
    }
  }

  return (
    <Container>
      <Typography variant="h2">You are now in a Game!</Typography>
      <Box sx={{ textAlign: "center", marginTop: 1 }}>
        <Button variant="outlined" onClick={() => startGame()}>
          Start Game
        </Button>
      </Box>
    </Container>
  );
};
export default SetupComponent;
