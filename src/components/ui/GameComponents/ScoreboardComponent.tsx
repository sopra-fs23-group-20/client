import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import SockJS from "sockjs-client";
import GameState from "models/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import MapContainer from "components/ui/MapContainer";
import Autocomplete from "@mui/material/Autocomplete";
import CountryOutline from "components/ui/CountryOutline";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";

interface Props {
  countryToGuess: String | null;
  currentUser: User | null;
}

const ScoreboardComponent: React.FC<Props> = (props) => {
  const countryToGuess = props.countryToGuess;
  const currentUser = props.currentUser;

  const navigate = useNavigate();

  const createGame = async (): Promise<void> => {
    try {
      const response = await api.post("/games", {
        username: currentUser?.username,
      });

      const gameId = response.data.gameId;

      // Redirect the user to the game page
      navigate(`/game/lobby/${gameId}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      navigate("/login");
    }
  };

  return (
    <Container>
      <div>
        <Typography variant="h2">
          {" "}
          Now the Scoreboard should be shown
        </Typography>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          The country to guess was: {countryToGuess}
        </Typography>
        <Button
          sx={{ marginTop: 2 }}
          variant="outlined"
          onClick={(e) => createGame()}
        >
          New Game
        </Button>
        <Button
          sx={{ marginLeft: 3, marginTop: 2 }}
          variant="outlined"
          onClick={() => {
            navigate("/game");
          }}
        >
          Back to Main Page
        </Button>
      </div>
    </Container>
  );
};
export default ScoreboardComponent;
