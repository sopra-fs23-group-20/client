import React, { useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import GameState from "models/constant/GameState";
import WebsocketType from "models/constant/WebsocketType";
import GuessingComponent from "components/ui/GameComponents/GuessingComponent";
import ScoreboardComponent from "components/ui/GameComponents/ScoreboardComponent";
import SetupComponent from "components/ui/GameComponents/SetupComponent";
import EndedComponent from "components/ui/GameComponents/EndedComponent";
import NotJoinedComponent from "components/ui/GameComponents/NotJoinedComponent";
import GameGetDTO from "models/GameGetDTO";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  convertToGameStateEnum,
  updateGameGetDTO,
} from "helpers/handleWebsocketUpdate";
import WebsocketPacket from "models/WebsocketPacket";
import { getDomain } from "helpers/getDomain";

const GameLobby: React.FC = () => {
  const navigate = useNavigate();

  const [gameGetDTO, setGameGetDTO] = useState<GameGetDTO | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [usePolling, setUsePolling] = useState(false);
  const isFetching = useRef(false);

  const gameId = window.location.pathname.split("/").pop();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    async function PollingfetchGame(): Promise<void> {
      try {
        const response = await api.get(`/games/${gameId}`);
        const newGameGetDTO: GameGetDTO = { ...response.data };
        console.log("Fetched Game : ", newGameGetDTO);
        setGameGetDTO(newGameGetDTO);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        console.error(error);
      }
    }

    let timeoutId: NodeJS.Timeout | undefined;

    const startPolling = async () => {
      if (!isFetching.current) {
        isFetching.current = true;
        await PollingfetchGame();
        isFetching.current = false;
      }
      if (usePolling) {
        timeoutId = setTimeout(startPolling, 200); // 0.2 seconds
      }
    };

    if (usePolling) {
      startPolling();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clean up the timeout when the component unmounts
      }
    };
  }, [usePolling]);

  useEffect(() => {
    async function fetchCountries(): Promise<void> {
      try {
        const response = await api.get("/games/" + gameId + "/countries");
        console.log("The response is: ", response);
        setAllCountries(response.data);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
      }
    }

    async function fetchGame(): Promise<void> {
      try {
        const response = await api.get(`/games/${gameId}`);
        const newGameGetDTO: GameGetDTO = { ...response.data };
        console.log("Fetched Game : ", newGameGetDTO);
        setGameGetDTO(newGameGetDTO);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        console.error(error);
      }
    }

    async function fetchUser(): Promise<void> {
      try {
        let id = localStorage.getItem("id");

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
      }
    }

    async function joinLobby(): Promise<void> {
      try {
        let id = localStorage.getItem("userId");
        console.log("Joining lobby");
        const response = await api.post(`/games/${gameId}/join`, currentUserId);
        console.log("Joined Lobby");
      } catch (error) {
        console.error(error);
      }
    }

    fetchGame();
    fetchCountries();
    fetchUser();
    joinLobby();
  }, []);

  useEffect(() => {
    const websocketUrl = `${getDomain()}/socket`;
    const socket = new SockJS(websocketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = (frame) => {
      setUsePolling(false);
      stompClient.subscribe(`/topic/games/${gameId}`, (message) => {
        handleGameUpdate(message);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error(`Stomp error: ${frame}`);
      setUsePolling(true);
    };

    stompClient.onWebSocketClose = (event) => {
      console.error("WebSocket connection closed:", event);
      setUsePolling(true);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [gameId]);

  function handleGameUpdate(message: IMessage): void {
    const messageObject = JSON.parse(message.body);
    const websocketPacket = new WebsocketPacket(
      messageObject.type,
      messageObject.payload
    );

    setGameGetDTO((prevGameGetDTO) => {
      const newGameGetDTO = updateGameGetDTO(prevGameGetDTO, websocketPacket);
      console.log("New GameGetDTO: ", newGameGetDTO);
      return newGameGetDTO;
    });
  }

  let content = <Typography variant="h2">Loading...</Typography>;

  if (gameGetDTO?.currentState == null) {
    return content;
  }

  switch (gameGetDTO.currentState) {
    case GameState.SETUP:
      console.log("Game state is setup");
      content = (
        <SetupComponent
          {...{
            gameGetDTO: gameGetDTO,
          }}
        />
      );
      break;
    case GameState.GUESSING:
      console.log("Game state is guessing");
      content = (
        <GuessingComponent
          {...{
            gameGetDTO: gameGetDTO,
            allCountries: allCountries,
            currentUserId: currentUserId,
          }}
        />
      );
      break;
    case GameState.SCOREBOARD:
      console.log("Game state is scoreboard");
      content = (
        <ScoreboardComponent
          {...{
            currentUser: currentUser,
            gameId: gameId,
            gameGetDTO: gameGetDTO,
            isGameEnded: false,
          }}
        />
      );
      break;
    case GameState.ENDED:
      console.log("Game state is ended");
      content = (
        <EndedComponent
          {...{
            currentUser: currentUser,
            gameId: gameId,
            gameGetDTO: gameGetDTO,
          }}
        />
      );
      break;
    case null:
      console.log("Game state is null");
      content = <NotJoinedComponent gameId={gameId}></NotJoinedComponent>;
      break;
    default:
      console.log("Unexpected game state:", gameGetDTO?.currentState);
      content = <div>Unexpected game state</div>;
      break;
  }

  return <Container sx={{ marginTop: 5 }}>{content}</Container>;
};

export default GameLobby;
