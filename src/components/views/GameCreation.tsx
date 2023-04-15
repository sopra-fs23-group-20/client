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
  IconButton,
  Tooltip,
} from "@mui/material";
import { AxiosError } from "axios";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { Switch } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import {
  TextField,
  DialogContent,
  DialogActions,
  FormControl,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import CategoryEnum from "models/constant/CategoryEnum";
import RegionEnum from "models/constant/RegionEnum";
import GamePostDTO from "models/GamePostDTO";
import InfoIcon from "@mui/icons-material/Info";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";

interface Props {
  gameId: string | undefined;
}

const GameCreation: React.FC<Props> = (props) => {
  const gameId = props.gameId;
  const navigate = useNavigate();

  const [roundSeconds, setRoundSeconds] = useState(30);
  const [randomizedHints, setRandomizedHints] = useState(false);
  const [countries, setCountries] = useState({
    africa: true,
    asia: true,
    europe: true,
    america: true,
    oceania: true,
  });
  const [numberOfRounds, setNumberOfRounds] = useState(3);
  const [openLobby, setOpenLobby] = useState(true);
  const [selectedHints, setSelectedHints] = useState({
    population: true,
    outline: true,
    flag: true,
    location: true,
    capital: true,
  });

  const typewriterText = useTypewriter("Game Settings");

  function transformHintsToCategorieEnumList(data: {
    population?: boolean;
    outline?: boolean;
    flag?: boolean;
    location?: boolean;
    capital?: boolean;
  }): CategoryEnum[] {
    let categoriesSelected: CategoryEnum[] = [];
    if (data.population) categoriesSelected.push(CategoryEnum.POPULATION);
    if (data.outline) categoriesSelected.push(CategoryEnum.OUTLINE);
    if (data.flag) categoriesSelected.push(CategoryEnum.FLAG);
    if (data.location) categoriesSelected.push(CategoryEnum.LOCATION);
    if (data.capital) categoriesSelected.push(CategoryEnum.CAPITAL);
    return categoriesSelected;
  }

  function transformCountriesToRegionsSelectedList(data: {
    africa?: boolean;
    asia?: boolean;
    europe?: boolean;
    america?: boolean;
    oceania?: boolean;
  }): RegionEnum[] {
    let regionsSelected: RegionEnum[] = [];
    if (data.africa) regionsSelected.push(RegionEnum.AFRICA);
    if (data.asia) regionsSelected.push(RegionEnum.ASIA);
    if (data.europe) regionsSelected.push(RegionEnum.EUROPE);
    if (data.america) regionsSelected.push(RegionEnum.AMERICA);
    if (data.oceania) regionsSelected.push(RegionEnum.OCEANIA);
    return regionsSelected;
  }

  async function startGame(): Promise<void> {
    const userIdString = localStorage.getItem("userId");

    try {
      if (userIdString) {
        const categoriesSelected =
          transformHintsToCategorieEnumList(selectedHints);

        const regionsSelected =
          transformCountriesToRegionsSelectedList(countries);
        const gamePostDTO = new GamePostDTO(
          userIdString,
          roundSeconds,
          numberOfRounds,
          categoriesSelected,
          regionsSelected,
          randomizedHints,
          openLobby
        );
        console.log("Game Post DTO: ", gamePostDTO);
        const response = await api.post("/games", gamePostDTO);
        console.log("Game Post Response: ", response.data);
        navigate(`/game/lobby/${response.data.gameId}`);
      }
    } catch (error: AxiosError | any) {
      console.log(error);
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
    <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Roboto Slab', serif",
            fontSize: "3rem",
            fontWeight: 800,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          {typewriterText}
        </Typography>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<KeyboardArrowLeftIcon />}
            onClick={() => navigate("/game/")}
          >
            Back to Dashboard
          </Button>
        </DialogActions>
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
                  sx={{ marginTop: "1rem" }}
                />
              </FormControl>
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
                <div>
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
                  <Tooltip
                    title="Open lobbies can be found by everyone in the lobby browser"
                    placement="top"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
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
              Save Settings
            </Button>
          </DialogActions>
        </FormControl>
      </Container>
    </div>
  );
};

export default GameCreation;
