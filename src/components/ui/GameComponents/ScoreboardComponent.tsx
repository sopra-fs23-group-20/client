import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import SockJS from "sockjs-client";
import GameState from "models/constant/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/constant/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import MapContainer from "components/ui/MapContainer";
import Autocomplete from "@mui/material/Autocomplete";
import CountryOutline from "components/ui/CountryOutline";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import GameGetDTO from "models/GameGetDTO";

interface Props {
  currentUser: User | null;
  gameId: string | undefined;
  gameGetDTO: GameGetDTO | null;
}

const ScoreboardComponent: React.FC<Props> = (props) => {
  const currentUser = props.currentUser;
  const gameId = props.gameId;
  const gameGetDTO = props.gameGetDTO;
  const navigate = useNavigate();
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);

  const getCurrentCountry = async () => {
    try {
      const response = await api.get(`/games/${gameId}/country`);
      const country = response.data;
      setCurrentCountry(country);
    } catch (error) {
      console.error(error);
    }
  };

  const createGame = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await api.post("/games", { userId: userId });
        const gameId = response.data.gameId;
        navigate(`/game/lobby/${gameId}`);
      }
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
          The country to guess was: {currentCountry}
        </Typography>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Time on Scoreboard Remaining until Next Round/Final Scoreboard:{" "}
          {gameGetDTO ? gameGetDTO.remainingTime : "undefined"}
        </Typography>
      </div>
    </Container>
  );
};
export default ScoreboardComponent;
