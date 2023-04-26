import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import HintContainer from "../HintContainer";
import GameGetDTO from "models/GameGetDTO";
import { useAlert } from "helpers/AlertContext";
interface Props {
  gameGetDTO: GameGetDTO | null;
  allCountries: Array<string>;
  currentUserId: string | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  const allCountries = props.allCountries;
  const game = props.gameGetDTO;
  const currentUserId = props.currentUserId;
  const { showAlert } = useAlert();

  const [valueEntered, setValueEntered] = useState<string | null>(null);

  async function submitGuess(): Promise<void> {
    try {
      console.log("Submitting guess", valueEntered);
      const request = await api.post(`/games/${game?.gameId}/guesses`, {
        userId: currentUserId,
        guess: valueEntered,
      });
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
    <Container
      sx={{
        marginTop: "10vh",
      }}
    >
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">
          Round:{" "}
          {game?.numberOfRounds != null && game?.remainingRounds != null
            ? game.numberOfRounds -
              game.remainingRounds +
              "/" +
              game.numberOfRounds
            : "undefined"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "5%",
          justifyContent: "space-between",
        }}
      >
        {game?.remainingTime ? (
          <Typography variant="h4">
            Time Left: {game.remainingTime.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}

        {game?.remainingRoundPoints ? (
          <Typography variant="h4">
            Points Left: {game.remainingRoundPoints.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}
      </Box>
      <Divider sx={{ marginTop: "5%" }}> Current Hint:</Divider>
      <Box sx={{ height: "50%", width: "100%", marginTop: "5%" }}>
        <HintContainer currentCaregory={game?.categoryStack?.currentCategory} />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
