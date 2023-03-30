import { useState } from "react";
import { api, handleError } from "helpers/api";
import {
  Button,
  Container,
  Typography,
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { AxiosError } from "axios";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { Switch } from "@mui/material";

import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import HintComponent from "../HintComponent";

interface Props {
  gameId: string | undefined;
}

const SetupComponent: React.FC<Props> = (props) => {
  const gameId = props.gameId;
  const [open, setOpen] = useState(false);
  const [roundSeconds, setRoundSeconds] = useState(30);
  const [randomizedHints, setRandomizedHints] = useState(false);
  const [allCountries, setAllCountries] = useState(false);
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [openLobby, setOpenLobby] = useState(false);
  const [selectedHints, setSelectedHints] = useState({
    population: false,
    outline: false,
    flag: false,
    location: false,
    capital: false,
  });

  async function startGame(): Promise<void> {
    try {
      await api.put(`/games/${gameId}/start`);
    } catch (error: AxiosError | any) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
    }
  }

  const handleSettingsOpen = () => {
    setOpen(true);
  };

  const handleSettingsClose = () => {
    setOpen(false);
  };

  const handleRoundSecondsChange = (event: SelectChangeEvent<number>) => {
    setRoundSeconds(parseInt(event.target.value as string, 10));
  };

  const handleRandomizedHintsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRandomizedHints(event.target.checked);
  };

  const handleAllCountriesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAllCountries(event.target.checked);
  };

  const handleNumberOfRoundsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value as string, 10);
    if (value >= 1 && value <= 10) {
      setNumberOfRounds(value);
    }
  };

  const handleOpenLobbyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOpenLobby(event.target.checked);
  };

  const handleHintChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedHints({
      ...selectedHints,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2">You are now in a Game!</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "1rem",
        }}
      >
        <Button variant="outlined" onClick={() => startGame()}>
          Start Game
        </Button>
        <Button variant="outlined" onClick={() => handleSettingsOpen()}>
          Settings
        </Button>
      </Box>
      <Dialog open={open} onClose={handleSettingsClose}>
        <DialogTitle>Game Settings</DialogTitle>
        <DialogContent>
          <FormControl sx={{ minWidth: "200px", marginBottom: "1rem" }}>
            <TextField
              id="round-seconds"
              label="Round Seconds"
              type="number"
              InputLabelProps={{
                shrink: true,
                sx: { marginTop: "0.25rem" },
              }}
              value={roundSeconds}
              onChange={(e) =>
                handleRoundSecondsChange({
                  target: { value: e.target.value },
                } as SelectChangeEvent<number>)
              }
              inputProps={{
                min: 10,
                max: 60,
                step: 10,
              }}
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
              value={numberOfRounds}
              onChange={handleNumberOfRoundsChange}
              inputProps={{
                min: 1,
                max: 10,
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={randomizedHints}
                  onChange={handleRandomizedHintsChange}
                />
              }
              label="Randomized Hints"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={allCountries}
                  onChange={handleAllCountriesChange}
                />
              }
              label="All Countries"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={openLobby}
                  onChange={(event) => handleOpenLobbyChange(event)}
                  color="primary"
                />
              }
              label="Open Lobby"
            />
          </FormGroup>
          <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Select Hints:</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.population}
                    onChange={handleHintChange}
                    name="population"
                  />
                }
                label="Population"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.outline}
                    onChange={handleHintChange}
                    name="outline"
                  />
                }
                label="Outline"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.flag}
                    onChange={handleHintChange}
                    name="flag"
                  />
                }
                label="Flag"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.location}
                    onChange={handleHintChange}
                    name="location"
                  />
                }
                label="Location"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.capital}
                    onChange={handleHintChange}
                    name="capital"
                  />
                }
                label="Capital"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Cancel</Button>
          <Button onClick={handleSettingsClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SetupComponent;
