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
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import HintContainer from "../HintContainer";
import GameGetDTO from "models/GameGetDTO";
import Logo from "../../views/images/GTCText.png";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  gameGetDTO: GameGetDTO | null;
  allCountries: Array<string>;
  currentUserId: string | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  const allCountries = props.allCountries;
  const game = props.gameGetDTO;
  const currentUserId = props.currentUserId;

  const [valueEntered, setValueEntered] = useState<string | null>(null);

  async function submitGuess(): Promise<void> {
    try {
      console.log("Submitting guess", valueEntered);
      const request = await api.post(`/games/${game?.gameId}/guesses`, {
        userId: currentUserId,
        guess: valueEntered,
      });
      const requestBody = request.data;
      alert(requestBody);
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
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
      <img src={Logo} alt="Logo" width={"100%"} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "5%",
          marginBottom: "5%",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allCountries}
          sx={{ width: "90%" }}
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
          <Typography variant="h5">
            Time Left: {game.remainingTime.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}

        {game?.remainingRoundPoints ? (
          <Typography variant="h5">
            Points Left: {game.remainingRoundPoints.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}
      </Box>
      <Divider sx={{ marginTop: "5%" }} />
      <Box sx={{ height: "50%", width: "100%", marginTop: "5%" }}>
        <HintContainer
          currentCaregory={game?.categoryStack?.currentCategory}
          width={
            window.innerWidth > 600
              ? window.innerWidth * 0.5
              : window.innerWidth * 0.85
          }
          height={window.innerHeight * 0.5}
        />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
