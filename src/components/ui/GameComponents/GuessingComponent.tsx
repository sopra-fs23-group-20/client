import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import HintComponent from "../HintComponent";
import GameGetDTO from "models/GameGetDTO";

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
  const [currentCountryHint, setCurrentCountryHint] = useState<Country>(
    new Country(null, null, null, null, null, null)
  );
  const [currentRoundPoints, setCurrentRoundPoints] = useState<number>(100);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  /*
  const socket = useWebSocket();

  useEffect(() => {
    if (socket !== null) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket]);

  const handleMessage = (event: MessageEvent) => {
    const websocketPackage = JSON.parse(event.data);
    const type = websocketPackage.type;
    const payload = websocketPackage.payload;
    console.log("Received a Message through websocket", websocketPackage);
    const typeTransformed = convertToWebsocketTypeEnum(type);
    const websocketPacket = new WebsocketPacket(typeTransformed, payload);
    console.log("The saved Packet is: ", websocketPacket);
    switch (websocketPacket.type) {
      case WebsocketType.CATEGORYUPDATE:
        if (websocketPacket.payload.hasOwnProperty("location")) {
          setCurrentCountryHint(
            new Country(
              null,
              websocketPacket.payload.population,
              websocketPacket.payload.capital,
              websocketPacket.payload.flag,
              websocketPacket.payload.location,
              websocketPacket.payload.outline
            )
          );
        }
        break;
      case WebsocketType.TIMEUPDATE:
        console.log("Setting remaining time to: ", websocketPacket.payload);
        setTimeRemaining(websocketPacket.payload);
        break;
      case WebsocketType.POINTSUPDATE:
        setCurrentRoundPoints(payload);
        break;
      case WebsocketType.PLAYERUPDATE || WebsocketType.GAMESTATEUPDATE:
        break;
    }
  };
  */

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h2">You are now in a Game!</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginTop: "5%" }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allCountries}
          sx={{ width: "100%"}}
          onChange={(event, value) => setValueEntered(value)}
          renderInput={(params) => (
            <TextField {...params} label="Enter your Guess here" />
          )}
        />

        {game?.remainingTime ? (
          <Typography variant="h4" sx={{ marginLeft: "5%" }}>
            Time Remaining: {game.remainingTime.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}

        {game?.remainingRoundPoints ? (
          <Typography variant="h4" sx={{ marginLeft: "5%" }}>
            Current Round Points: {game.remainingRoundPoints.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}

        <Typography variant="h4" sx={{ marginLeft: "5%" }}>
          Currently on Round:{" "}
          {game?.numberOfRounds != null && game?.remainingRounds != null
            ? game.numberOfRounds -
              game.remainingRounds +
              "/" +
              game.numberOfRounds
            : "undefined"}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        sx={{ marginTop: "2%" }}
        onClick={() => submitGuess()}
        disabled={hasPlayerGuessed()}
      >
        Submit your Guess
      </Button>

      <Box sx={{ height: "50%", width: "100%", marginTop: "5%" }}>
        <HintComponent currentCaregory={game?.categoryStack?.currentCategory} />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
