import React, { useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import GameState from "models/constant/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/constant/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import GuessingComponent from "components/ui/GameComponents/GuessingComponent";
import ScoreboardComponent from "components/ui/GameComponents/ScoreboardComponent";
import SetupComponent from "components/ui/GameComponents/SetupComponent";
import EndedComponent from "components/ui/GameComponents/EndedComponent";
import { useWebSocket } from "helpers/WebSocketContext";
import NotJoinedComponent from "components/ui/GameComponents/NotJoinedComponent";
import GameUser from "../../models/GameUser";
import GameGetDTO from "models/GameGetDTO";

const GameLobby: React.FC = () => {
  const socket = useWebSocket();
  const navigate = useNavigate();

  const [gameGetDTO, setGameGetDTO] = useState<GameGetDTO | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const gameId = window.location.pathname.split("/").pop();
  const currentUserId = localStorage.getItem("userId");
  const websocketUrl = `${getDomain()}/game/${gameId}`;

  function convertToWebsocketTypeEnum(
    typeString: string
  ): WebsocketType | undefined {
    switch (typeString) {
      case "GAMESTATEUPDATE":
        return WebsocketType.GAMESTATEUPDATE;
      case "CATEGORYUPDATE":
        return WebsocketType.CATEGORYUPDATE;
      case "TIMEUPDATE":
        return WebsocketType.TIMEUPDATE;
      case "PLAYERUPDATE":
        return WebsocketType.PLAYERUPDATE;
      case "POINTSUPDATE":
        return WebsocketType.POINTSUPDATE;
      default:
        console.error(`Invalid WebsocketType string received: ${typeString}`);
        return undefined;
    }
  }

  function convertToGameStateEnum(type: string | null): GameState | null {
    if (type === null) return null;
    switch (type) {
      case "SETUP":
        return GameState.SETUP;
      case "GUESSING":
        return GameState.GUESSING;
      case "SCOREBOARD":
        return GameState.SCOREBOARD;
      case "ENDED":
        return GameState.ENDED;
      default:
        console.error(`Invalid GameState string received: ${type}`);
        return null;
    }
  }

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

  const isFetching = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const startPolling = async () => {
      if (!isFetching.current) {
        isFetching.current = true;
        await PollingfetchGame();
        isFetching.current = false;
      }
      timeoutId = setTimeout(startPolling, 200); // 0.2 seconds
    };

    startPolling();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clean up the timeout when the component unmounts
      }
    };
  }, []);

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

    fetchCountries();
    fetchUser();
    joinLobby();
  }, [gameId]);

  /*
  useEffect(() => {
    if (socket && game !== null && currentUser !== null) {
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
      case WebsocketType.GAMESTATEUPDATE:
        if (websocketPacket.payload === "SCOREBOARD") {
          getCountry();
        }
        const gameStateTemp: GameState | null = convertToGameStateEnum(
          websocketPacket.payload
        );
        handleSetGameState(gameStateTemp);
        break;

      case WebsocketType.PLAYERUPDATE:
        if (game !== null) {
          const gameState = convertToGameStateEnum(websocketPacket.payload);
          handleSetGameState(gameState, game, currentUser);
        }
        break;
    }
   
  };
 */

  let content = <Typography variant="h2">Loading...</Typography>;

  function getPlayersGameState(): string | null {
    const participants = gameGetDTO?.participants;
    if (participants == null || currentUserId == null) {
      return null;
    }
    for (const participant of participants) {
      if (participant.userId == parseInt(currentUserId)) {
        if (participant.currentState == null) {
          return null;
        }
        return participant.currentState.toString();
      }
    }
    return null;
  }

  switch (convertToGameStateEnum(getPlayersGameState())) {
    case GameState.SETUP:
      console.log("case SETUP");
      content = (
        <SetupComponent
          {...{
            gameGetDTO: gameGetDTO,
          }}
        />
      );
      break;
    case GameState.GUESSING:
      console.log("case Guessing");
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
      console.log("case Scoreboard");
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
      console.log("case ENDED");
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
      console.log("case null");
      content = <NotJoinedComponent gameId={gameId}></NotJoinedComponent>;
      break;
  }

  return <Container sx={{ marginTop: 5 }}>{content}</Container>;
};

export default GameLobby;
