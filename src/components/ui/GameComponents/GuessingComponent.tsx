import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import {
  Box,
  Button,
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

interface Props {
  gameGetDTO: GameGetDTO | null;
  allCountries: Array<string>;
  currentUserId: string | null;
  setLastGuess: Function;
}

function getColorForProgress(progress: number) {
  const red = Math.round(255 * (1 - progress));
  const green = Math.round(255 * progress);
  return `rgb(${red}, ${green}, 0)`;
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

  const progressBarGradient = getColorForProgress(
    normalise(game?.remainingTime, game?.roundDuration) / 100
  );

  const [valueEntered, setValueEntered] = useState<string | null>(null);
  let currentRound = 0;
  if (game?.numberOfRounds != null && game.remainingRounds != null) {
    currentRound = game?.numberOfRounds - game?.remainingRounds;
  }

  async function submitGuess(): Promise<void> {
    try {
      console.log("Submitting guess", valueEntered);
      const guess = {
        userId: currentUserId,
        guess: valueEntered,
      };
      setLastGuess(guess);
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

  const formatNumber = (number: number): string => {
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return formattedNumber.replace(/,/g, "'");
  };

  const hasPlayerGuessed = (): boolean => {
    const gameUsers = game?.participants;
    if (gameUsers == null || gameUsers == undefined) return false;
    const gameUsersArray = Array.from(gameUsers);
    for (let i = 0; i < gameUsersArray.length; i++) {
      if (gameUsersArray[i].userId == currentUserId) {
        if (
          gameUsersArray[i].hasAlreadyGuessed == null ||
          gameUsersArray[i].hasAlreadyGuessed == undefined
        ) {
          return false;
        }
        if (gameUsersArray[i].hasAlreadyGuessed == true) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "5%",
          marginBottom: "5%",
          width: "100%",
          height: "200%",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allCountries}
          sx={{ width: "90%", height: "200%" }}
          onChange={(event, value) => setValueEntered(value)}
          renderInput={(params) => (
            <TextField {...params} label="Enter your Guess here" />
          )}
        />
        <Button
          variant="outlined"
          sx={{ marginLeft: "2%", height: "100%" }}
          onClick={() => submitGuess()}
          disabled={hasPlayerGuessed()}
        >
          Submit
        </Button>
      </Box>

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
          />
          <LinearProgress
            variant="determinate"
            value={normalise(game?.remainingTime, game?.roundDuration)}
            sx={{
              flexGrow: 1,
              marginLeft: "2%",
            }}
            style={{
              background: progressBarGradient,
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
      <Divider sx={{ marginTop: "5%" }}> Current Hint:</Divider>
      <Box sx={{ height: "50%", width: "100%", marginTop: "5%" }}>
        <HintContainer currentCaregory={game?.categoryStack?.currentCategory} />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
