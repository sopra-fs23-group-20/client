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
  Grid,
} from "@mui/material";
import { AxiosError } from "axios";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { Switch } from "@mui/material";

import {
  TextField,
  DialogContent,
  DialogActions,
  FormControl,
} from "@mui/material";

interface Props {
  gameId: string | undefined;
}

const GameCreationComponent: React.FC<Props> = (props) => {
  const gameId = props.gameId;
  const [roundSeconds, setRoundSeconds] = useState(30);
  const [randomizedHints, setRandomizedHints] = useState(false);
  const [countries, setCountries] = useState({
    africa: false,
    asia: false,
    europe: false,
    america: false,
    oceania: false,
    all: false,
  });
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [openLobby, setOpenLobby] = useState(false);
  const [selectedHints, setSelectedHints] = useState({
    population: false,
    outline: false,
    flag: false,
    location: false,
    capital: false,
  });
  const userId = localStorage.getItem("userId");

  async function startGame(): Promise<void> {
    try {
      if (userId) {
        const response = await api.post("/games", { userId: userId });
        const requestBody = {
          roundSeconds,
          randomizedHints,
          countries: Object.keys(countries).filter(
            (country) => countries[country as keyof typeof countries]
          ),
          numberOfRounds,
          openLobby,
          hints: Object.keys(selectedHints).filter(
            (hint) => selectedHints[hint as keyof typeof selectedHints]
          ),
        };

        await api.post(`/games/`, requestBody);
      }
    } catch (error: AxiosError | any) {
      alert(
        `Something went wrong while updating game settings: \n${handleError(
          error
        )}`
      );
    }
  }

  const handleRoundSecondsChange = (event: SelectChangeEvent<number>) => {
    setRoundSeconds(parseInt(event.target.value as string, 10));
  };

  const handleRandomizedHintsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRandomizedHints(event.target.checked);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCountries({
      ...countries,
      [name as keyof typeof countries]: checked,
    });
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
    const { name, checked } = event.target;
    setSelectedHints({
      ...selectedHints,
      [name as keyof typeof selectedHints]: checked,
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
      <Typography variant="h2">Choose Game Settings</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "1rem",
        }}
      ></Box>
      <FormControl>
        <DialogContent>
          <Grid item xs={5}>
            <FormControl sx={{ minWidth: "200px", marginBottom: "1rem" }}>
              <TextField
                id="round-seconds"
                label="Round Seconds"
                type="number"
                InputLabelProps={{
                  shrink: true,
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
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={randomizedHints}
                onChange={handleRandomizedHintsChange}
              />
            }
            label="Randomized Hints"
          />
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Typography variant="subtitle1">Select Region:</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={countries.africa}
                      onChange={handleCountryChange}
                      name="africa"
                    />
                  }
                  label="Africa"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={countries.asia}
                      onChange={handleCountryChange}
                      name="asia"
                    />
                  }
                  label="Asia"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={countries.europe}
                      onChange={handleCountryChange}
                      name="europe"
                    />
                  }
                  label="Europe"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={countries.america}
                      onChange={handleCountryChange}
                      name="america"
                    />
                  }
                  label="America"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={countries.oceania}
                      onChange={handleCountryChange}
                      name="oceania"
                    />
                  }
                  label="Oceania"
                />
              </FormGroup>

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
            </Grid>
            <Grid item xs={5}>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => startGame()}>
            Save
          </Button>
        </DialogActions>
      </FormControl>
    </Container>
  );
};

export default GameCreationComponent;
