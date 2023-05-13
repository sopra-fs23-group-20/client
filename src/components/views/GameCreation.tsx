import { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import {
  Button,
  Container,
  Typography,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Grid,
  IconButton,
  Tooltip,
  InputLabel,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { Switch } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useAlert } from "helpers/AlertContext";
import {
  TextField,
  DialogContent,
  DialogActions,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryEnum from "models/constant/CategoryEnum";
import RegionEnum from "models/constant/RegionEnum";
import GamePostDTO from "models/GamePostDTO";
import InfoIcon from "@mui/icons-material/Info";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from "axios";
import { CategoryStack } from "models/CategoryStack";
import Category from "models/Category";
import { Difficulty, stringToDifficulty } from "models/constant/Difficulty";
import { GameMode, stringToGameMode } from "models/constant/GameMode";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

interface Props {
  gameId: string | undefined;
}

const GameCreation: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const [roundSeconds, setRoundSeconds] = useState(45);
  const [randomizedHints, setRandomizedHints] = useState(false);

  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const [openLobby, setOpenLobby] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(
    Difficulty.MEDIUM
  );
  const [timeBetweenRounds, setTimeBetweenRounds] = useState(7);

  const { showAlert } = useAlert();

  const [selectedRegions, setSelectedRegions] = useState<RegionEnum[]>([
    RegionEnum.EUROPE,
    RegionEnum.AFRICA,
    RegionEnum.AMERICA,
    RegionEnum.ANTARCTICA,
    RegionEnum.ASIA,
    RegionEnum.OCEANIA,
  ]);
  const [selectedHints, setSelectedHints] = useState<CategoryEnum[]>([
    CategoryEnum.POPULATION,
    CategoryEnum.OUTLINE,
    CategoryEnum.LOCATION,
    CategoryEnum.FLAG,
    CategoryEnum.CAPITAL,
  ]);

  const [checkedHints, setCheckedHints] = useState<
    Record<CategoryEnum, boolean>
  >({
    [CategoryEnum.POPULATION]: true,
    [CategoryEnum.OUTLINE]: true,
    [CategoryEnum.LOCATION]: true,
    [CategoryEnum.FLAG]: true,
    [CategoryEnum.CAPITAL]: true,
  });

  const allCategories = Object.keys(checkedHints).map(
    (key) => CategoryEnum[key as keyof typeof CategoryEnum]
  );

  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(
    GameMode.NORMAL
  );

  const [numberOfGuesses, setNumberOfGuesses] = useState(1);

  const remainingCategories = allCategories.filter(
    (category) => !selectedHints.includes(category)
  );

  const typewriterText = useTypewriter("Game Settings");

  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (
      selectedRegions.length === 1 &&
      selectedRegions.includes(RegionEnum.ANTARCTICA)
    ) {
      setNumberOfRounds(2);
      setInfoMessage(
        "Maximum number of rounds set to 2 since Antarctica only has 2 countries."
      );
    } else {
      setInfoMessage("");
    }
  }, [selectedRegions]);

  function shuffleArray(array: CategoryEnum[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function isFormValid() {
    return selectedRegions.length > 0 && selectedHints.length > 0;
  }

  function stringToCategoryEnum(
    categoryString: string
  ): CategoryEnum | undefined {
    switch (categoryString) {
      case "Population":
        return CategoryEnum.POPULATION;
      case "Outline":
        return CategoryEnum.OUTLINE;
      case "Flag":
        return CategoryEnum.FLAG;
      case "Location":
        return CategoryEnum.LOCATION;
      case "Capital":
        return CategoryEnum.CAPITAL;
      default:
        return undefined;
    }
  }

  function stringToRegionEnum(regionString: string): RegionEnum | undefined {
    switch (regionString) {
      case "Africa":
        return RegionEnum.AFRICA;
      case "Asia":
        return RegionEnum.ASIA;
      case "Europe":
        return RegionEnum.EUROPE;
      case "Americas":
        return RegionEnum.AMERICA;
      case "Oceania":
        return RegionEnum.OCEANIA;
      case "Antarctica":
        return RegionEnum.ANTARCTICA;
      default:
        return undefined;
    }
  }

  async function startGame(): Promise<void> {
    const userIdString = localStorage.getItem("userId");

    try {
      if (userIdString) {
        const reversedSelectedHints = selectedHints.slice().reverse();
        const filteredSelectedHints = reversedSelectedHints.filter(
          (hint) => checkedHints[hint]
        );
        if (filteredSelectedHints && filteredSelectedHints.length > 0) {
          const currentCategoryEnum = filteredSelectedHints[0];
          const currentCategory = new Category(currentCategoryEnum);

          const gamePostDTO = new GamePostDTO(
            userIdString,
            roundSeconds,
            numberOfRounds,
            new CategoryStack(
              currentCategory,
              filteredSelectedHints,
              remainingCategories,
              null,
              randomizedHints,
              null
            ),
            selectedRegions,
            openLobby,
            difficulty,
            timeBetweenRounds,
            selectedGameMode,
            numberOfGuesses
          );
          const response = await api.post("/games", gamePostDTO);
          navigate(`/game/lobby/${response.data.gameId}`);
        } else {
          showAlert("Please select at least one category", "warning");
        }
      }
    } catch (error: AxiosError | any) {
      console.log(error);
      showAlert(
        `Something went wrong while updating game settings: \n${handleError(
          error
        )}`,
        "error"
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
    if (event.target.checked) {
      shuffleArray(selectedHints);
      setSelectedHints([...selectedHints]);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const region = stringToRegionEnum(name);

    if (!region) {
      return;
    }

    setSelectedRegions((prevRegions) => {
      let newRegions = [...prevRegions];
      if (checked) {
        newRegions.push(region);
      } else {
        newRegions = newRegions.filter((r) => r !== region);
      }
      return newRegions;
    });
  };

  const handleNumberOfRoundsChange = (event: { target: { value: any } }) => {
    let newValue = event.target.value;

    const maxRounds =
      selectedRegions.length === 1 &&
      selectedRegions.includes(RegionEnum.ANTARCTICA)
        ? 2
        : 10;

    if (newValue > maxRounds) {
      newValue = maxRounds;
    }

    setNumberOfRounds(newValue);
  };

  const handleTimeBetweenRoundsChange = (event: { target: { value: any } }) => {
    let newValue = event.target.value;

    setTimeBetweenRounds(newValue);
  };

  const handleNumberOfGuessesChange = (event: { target: { value: any } }) => {
    let newValue = event.target.value;

    setNumberOfGuesses(newValue);
  };

  const handleOpenLobbyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOpenLobby(event.target.checked);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newHints = [...selectedHints];
    const [removed] = newHints.splice(result.source.index, 1);
    newHints.splice(result.destination.index, 0, removed);

    setSelectedHints(newHints);
  };

  const handleHintChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: CategoryEnum
  ) => {
    const { checked } = event.target;
    setCheckedHints((prevCheckedHints) => ({
      ...prevCheckedHints,
      [category]: checked,
    }));
  };

  return (
    <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10vh",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            minHeight: "56px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          {typewriterText}
        </Typography>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            sx={{ mb: 4 }}
            variant="outlined"
            size="small"
            color="error"
            startIcon={<KeyboardArrowLeftIcon />}
            onClick={() => navigate("/game/")}
          >
            Back to Dashboard
          </Button>
        </DialogActions>

        <FormControl>
          <DialogContent>
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="game-mode-select-label">Game Mode</InputLabel>
                  <Select
                    labelId="game-mode-select-label"
                    id="game-mode-select"
                    value={selectedGameMode}
                    onChange={(event) => {
                      setSelectedGameMode(stringToGameMode(event.target.value));
                    }}
                    label="Game Mode"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: "8px", // Add 8px of margin to the top
                        },
                      },
                    }}
                  >
                    <MenuItem value={GameMode.NORMAL}>
                      {GameMode.NORMAL}
                    </MenuItem>
                    <MenuItem value={GameMode.BLITZ}>{GameMode.BLITZ}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="difficulty-select-label">
                    Difficulty
                  </InputLabel>
                  <Select
                    labelId="difficulty-select-label"
                    id="difficulty-select"
                    value={difficulty}
                    onChange={(event) => {
                      setDifficulty(stringToDifficulty(event.target.value));
                    }}
                    label="Difficulty"
                  >
                    <MenuItem value={Difficulty.EASY}>
                      {Difficulty.EASY}
                    </MenuItem>
                    <MenuItem value={Difficulty.MEDIUM}>
                      {Difficulty.MEDIUM}
                    </MenuItem>
                    <MenuItem value={Difficulty.HARD}>
                      {Difficulty.HARD}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    id="round-seconds"
                    label="Number of Guesses"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={numberOfGuesses}
                    onChange={(e) =>
                      handleNumberOfGuessesChange({
                        target: { value: e.target.value },
                      } as SelectChangeEvent<number>)
                    }
                    inputProps={{
                      min: 1,
                      max: 5,
                      step: 1,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }}>
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
                      max:
                        selectedRegions.length === 1 &&
                        selectedRegions.includes(RegionEnum.ANTARCTICA)
                          ? 2
                          : 10,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    id="round-seconds"
                    label="Seconds to Guess"
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
              </Grid>

              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    id="time-between-rounds"
                    label="Time Between Rounds"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={timeBetweenRounds}
                    onChange={handleTimeBetweenRoundsChange}
                    inputProps={{
                      min: 1,
                      max:
                        selectedRegions.length === 1 &&
                        selectedRegions.includes(RegionEnum.ANTARCTICA)
                          ? 2
                          : 10,
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">
                        Select Region
                        <Tooltip
                          title="Select a minimum of 1 region"
                          placement="right"
                        >
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.AFRICA
                              )}
                              onChange={handleCountryChange}
                              name="Africa"
                            />
                          }
                          label="Africa"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.ASIA
                              )}
                              onChange={handleCountryChange}
                              name="Asia"
                            />
                          }
                          label="Asia"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.EUROPE
                              )}
                              onChange={handleCountryChange}
                              name="Europe"
                            />
                          }
                          label="Europe"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.AMERICA
                              )}
                              onChange={handleCountryChange}
                              name="Americas"
                            />
                          }
                          label="America"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.OCEANIA
                              )}
                              onChange={handleCountryChange}
                              name="Oceania"
                            />
                          }
                          label="Oceania"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(
                                RegionEnum.ANTARCTICA
                              )}
                              onChange={handleCountryChange}
                              name="Antarctica"
                            />
                          }
                          label="Antarctica"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="error">
                      {infoMessage}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    Select Hints
                    <Tooltip
                      title="Select a minimum of 1 hint, you can also change the order by moving hints up or down"
                      placement="right"
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="hintList">
                      {(provided: DroppableProvided) => (
                        <FormGroup
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {selectedHints.map((hint, index) => (
                            <Draggable
                              key={hint}
                              draggableId={hint}
                              index={index}
                            >
                              {(provided: DraggableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <FormControlLabel
                                    {...provided.dragHandleProps}
                                    control={
                                      <Checkbox
                                        checked={checkedHints[hint]}
                                        onChange={(event) =>
                                          handleHintChange(event, hint)
                                        }
                                        name={CategoryEnum[hint]}
                                      />
                                    }
                                    label={
                                      <>
                                        <ListItemIcon sx={{ mr: "-20px" }}>
                                          <DragIndicatorIcon />
                                        </ListItemIcon>

                                        {CategoryEnum[hint]}
                                      </>
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </FormGroup>
                      )}
                    </Droppable>
                  </DragDropContext>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        randomizedHints === null ? undefined : randomizedHints
                      }
                      onChange={handleRandomizedHintsChange}
                      disabled={selectedHints.length === 1}
                    />
                  }
                  label="Randomized Hints"
                />
              </Grid>
            </Grid>
            <div>
              <Grid sx={{ marginTop: 2 }} container alignItems="center">
                <Grid item>
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
                <Grid item>
                  <Tooltip
                    title="Open lobbies can be found by everyone in the lobby browser"
                    placement="right"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </div>

            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ mt: 2, mb: 2 }}
                variant="outlined"
                onClick={() => startGame()}
                disabled={!isFormValid()}
              >
                Save Settings
              </Button>
            </DialogActions>
          </DialogContent>
        </FormControl>
      </Container>
    </div>
  );
};
export default GameCreation;
