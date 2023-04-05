import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormGroup,
  FormControl,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import Game from "models/Game";

interface Props {
  game: Game | null;
  allCountries: Array<string>;
}

const GuessingComponent: React.FC<Props> = (props) => {
  const game = props.game;
  const userId = localStorage.getItem("userId");

  async function startGame(): Promise<void> {
    try {
      const request = await api.put(
        `/games/${game ? game.gameId : null}/start`,
        {
          userId: userId,
        }
      );
      const requestBody = request.data;
      alert(requestBody);
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
    }
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2">Game Settings</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "1rem",
        }}
      ></Box>
      <FormControl>
        <DialogContent>
          <FormControl sx={{ minWidth: "200px", marginBottom: "1rem" }}>
            <TextField
              id="round-seconds"
              label="Round Seconds"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={game?.roundDuration}
              disabled={true}
            />
          </FormControl>

          <FormGroup>
            <TextField
              id="number-of-rounds"
              label="Number of Rounds"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={game?.numberOfRounds}
              disabled={true}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={game?.openLobby ?? false}
                  disabled={true}
                  color="primary"
                />
              }
              label="Open Lobby"
            />
          </FormGroup>

          <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Selected Hints:</Typography>
            {game?.categoryStack?.selectedCategories.map((category, index) => (
              <Box key={index} sx={{ marginBottom: "1rem" }}>
                <FormControl sx={{ minWidth: "200px" }}>
                  <TextField
                    id={`selected-category-${index}`}
                    label={`Selected Category ${index + 1}`}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={category}
                    disabled={true}
                  />
                </FormControl>
              </Box>
            ))}
          </FormControl>
        </DialogContent>
      </FormControl>
      <Button variant="outlined" onClick={() => startGame()}>
        Start Game
      </Button>
    </Container>
  );
};
export default GuessingComponent;
