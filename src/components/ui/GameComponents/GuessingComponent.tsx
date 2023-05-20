import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import HintContainer from "../HintContainer";
import GameGetDTO from "models/GameGetDTO";
import { useAlert } from "helpers/AlertContext";
import CircularProgressWithLabel from "helpers/CircularProgressWithLabel";
import getColorByTimeLeft from "helpers/getColorByTimeLeft";
import { GameMode } from "models/constant/GameMode";
import ButtonSelection from "helpers/ButtonSelection";
import GameUser from "models/GameUser";

interface Props {
  gameGetDTO: GameGetDTO | null;
  allCountries: Array<string>;
  currentUserId: string | null;
  setLastGuess: Function;
}

const normalise = (
  value: number | null | undefined,
  max: number | null | undefined
) => {
  if (value == null || max == null) return 0;
  return (value * 100) / max;
};

const GuessingComponent: React.FC<Props> = (props) => {
  const allCountries = props.allCountries;
  const game = props.gameGetDTO;
  const currentUserId = props.currentUserId;
  const { showAlert } = useAlert();
  const setLastGuess = props.setLastGuess;

  const [valueEntered, setValueEntered] = useState<string | null>(null);
  let currentRound = 0;
  if (game?.numberOfRounds != null && game.remainingRounds != null) {
    currentRound = game?.numberOfRounds - game?.remainingRounds;
  }

  async function submitGuess(countryGuess: string | null): Promise<void> {
    try {
      const guess = {
        userId: currentUserId,
        guess: countryGuess,
      };
      setLastGuess(guess);
      setValueEntered(null);
      const request = await api.post(`/games/${game?.gameId}/guesses`, guess);
      const requestBody = request.data;

      if (requestBody.includes("wrong")) {
        showAlert(requestBody, "error");
      } else {
        showAlert(requestBody, "success");
      }
    } catch (error: AxiosError | any) {
      showAlert(error.response.data.message, "error");
    }
  }

  const outOfGuesses = (): boolean => {
    const gameUsers = game?.participants;
    if (gameUsers == null || gameUsers == undefined || currentUserId == null)
      return false;
    const gameUsersArray = Array.from(gameUsers);
    const userIdAsNumber = parseInt(currentUserId, 10);
    for (const gameUser of gameUsersArray) {
      if (
        gameUser.userId == userIdAsNumber &&
        gameUser.numberOfGuessesLeft != null
      ) {
        if (gameUser.numberOfGuessesLeft <= 0 || gameUser.guessedCorrectly) {
          return true;
        }
      }
    }
    return false;
  };

  const remainingGuesses = (): number => {
    const gameUsers = game?.participants;
    if (gameUsers == null || gameUsers == undefined || currentUserId == null)
      return 0;
    const gameUsersArray = Array.from(gameUsers);
    const userIdAsNumber = parseInt(currentUserId, 10);
    for (const gameUser of gameUsersArray) {
      if (
        gameUser.userId == userIdAsNumber &&
        gameUser.numberOfGuessesLeft != null
      ) {
        return gameUser.numberOfGuessesLeft;
      }
    }
    return 0;
  };

  const dividerText = (): string => {
    if (
      game == null ||
      game.roundDuration == null ||
      game.categoryStack == null ||
      game.categoryStack.selectedCategories == null ||
      game.categoryStack.remainingCategories == null ||
      game.remainingTime == null ||
      game.categoryStack.currentCategory?.type == undefined
    ) {
      return "Yeet";
    }
    const timeBetweenCategoryUpdates =
      game?.roundDuration / game.categoryStack.selectedCategories.length;
    const timeToNextUpdate =
      game.remainingTime +
      2 -
      timeBetweenCategoryUpdates *
        game.categoryStack.remainingCategories.length;
    let currentActualHint = game.categoryStack.currentCategory?.type.toString();
    currentActualHint =
      currentActualHint.charAt(0).toUpperCase() +
      currentActualHint.slice(1).toLowerCase();

    const currentHintText = `Current Hint: ${currentActualHint}`;
    let nextHintText = "";
    if (game.categoryStack.remainingCategories.length >= 1) {
      let nextActualHint =
        game.categoryStack.remainingCategories[
          game.categoryStack.remainingCategories.length - 1
        ].toString();
      nextActualHint =
        nextActualHint.charAt(0).toUpperCase() +
        nextActualHint.slice(1).toLowerCase();
      nextHintText = ` | Next Hint: ${nextActualHint} in ${timeToNextUpdate} seconds`;
    } else {
      nextHintText = ` | Game finished in ${game.remainingTime} seconds`;
    }

    return currentHintText + nextHintText;
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "2rem",
          justifyContent: "center",
        }}
      >
        <CircularProgressWithLabel
          value={normalise(remainingGuesses(), game?.numberOfGuesses)}
          currentRound={remainingGuesses()}
          numberOfRounds={game?.numberOfGuesses}
          text="Remaining Guesses"
        />
      </Box>
      {game?.gameMode === GameMode.BLITZ ? (
        <ButtonSelection
          hasPlayerGuessed={outOfGuesses}
          gameGetDTO={game}
          submitGuess={submitGuess}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
            width: "100%",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={allCountries}
            value={valueEntered}
            sx={{ width: "90%", height: "200%" }}
            onChange={(event, value) => setValueEntered(value)}
            renderInput={(params) => (
              <TextField {...params} label="Enter your Guess here" />
            )}
          />
          <Button
            variant="outlined"
            size="large"
            sx={{ marginLeft: "2%", height: "100%" }}
            onClick={() => submitGuess(valueEntered)}
            disabled={!valueEntered || outOfGuesses()}
          >
            Submit
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {game?.remainingTime != null ? (
            <Typography variant="h4">
              Remaining Time: {game.remainingTime.toString()}
            </Typography>
          ) : (
            <div></div>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CircularProgressWithLabel
            value={normalise(currentRound, game?.numberOfRounds)}
            currentRound={currentRound}
            numberOfRounds={game?.numberOfRounds}
            text="Round"
          />
          <LinearProgress
            variant="determinate"
            value={normalise(game?.remainingTime, game?.roundDuration)}
            color={getColorByTimeLeft(game?.remainingTime, game?.roundDuration)}
            sx={{
              flexGrow: 1,
              marginLeft: "2%",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {game?.remainingRoundPoints != null ? (
            <Typography variant="h4">
              Achievable Points: {game.remainingRoundPoints.toString()}
            </Typography>
          ) : (
            <div></div>
          )}
        </Box>
      </Box>
      <Divider sx={{ marginTop: "2rem" }}>
        <Chip
          size="medium"
          color="info"
          variant="outlined"
          label={dividerText()}
        ></Chip>{" "}
      </Divider>
      <Box sx={{ height: "50%", width: "100%", marginTop: "5%" }}>
        <HintContainer currentCaregory={game?.categoryStack?.currentCategory} />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
