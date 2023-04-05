import React, { useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import GameState from "models/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import GuessingComponent from "components/ui/GameComponents/GuessingComponent";
import ScoreboardComponent from "components/ui/GameComponents/ScoreboardComponent";
import SetupComponent from "components/ui/GameComponents/SetupComponent";
import EndedComponent from "components/ui/GameComponents/EndedComponent";
import { useWebSocket } from "helpers/WebSocketContext";
import NotJoinedComponent from "components/ui/GameComponents/NotJoinedComponent";
import GameUser from "../../models/GameUser";
import Game from "models/Game";

const GameLobby: React.FC = () => {
  const socket = useWebSocket();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentRoundPoints, setCurrentRoundPoints] = useState<number>(100);
  const [game, setGame] = useState<Game | null>(null);

  const [currentCountryHint, setCurrentCountryHint] = useState<Country>(
    new Country(null, null, null, null, null, null)
  );

  const [countryToGuess, setCountryToGuess] = useState<String | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentGameUser, setCurrentGameUser] = useState<GameUser | null>(null);

  const gameId = window.location.pathname.split("/").pop();
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

  function convertToGameStateEnum(type: string): GameState | null {
    switch (type) {
      case "SETUP":
        return GameState.SETUP;
      case "GUESSING":
        return GameState.GUESSING;
      case "SCOREBOARD":
        return GameState.SCOREBOARD;
      case "Ended":
        return GameState.ENDED;
      default:
        console.error(`Invalid GameState string received: ${type}`);
        return null;
    }
  }

  useEffect(() => {
    async function fetchData(): Promise<Array<string>> {
      try {
        const response = await api.get("/games/" + gameId + "/countries");
        console.log("The response is: ", response);
        return response.data
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
        return new Array<string>()
      }
    }
    async function fetchGame(): Promise<Game|null> {
      try {
        const response = await api.get(`/games/${gameId}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });
        console.log("The response is: ", response);
        const currentState = convertToGameStateEnum(response.data.currentState)
        return {...response.data, currentState}
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        console.error(error);
        return null
      }
    }

    async function fetchUser(): Promise<User|null> {
      try {
        let id = localStorage.getItem("id");

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });
        return response.data
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
        return null
      }
    }

    async function joinLobby(): Promise<void> {
      try {
        let id = localStorage.getItem("userId");
        console.log("Joining lobby");
        const response = await api.post(`/games/${gameId}/join`, id);
        console.log("Joined Lobby");
      } catch (error) {
        console.error(error);
      }
    }

    async function setStates(): Promise<void> {
      const countries = await fetchData();
      setAllCountries(countries);
      const game = await fetchGame();
      setGame(game);
      const user = await fetchUser();
      setCurrentUser(user);
      if(game !== null){
        handleSetGameState(game.currentState, game, user)
      }
      await joinLobby()
    }
    setStates()
  }, [gameId]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket, game, currentUser]);

  const handleSetGameState = (newGameState: GameState|null, gameState: Game|null = game, currentUserState: User|null = currentUser) => {
    if (newGameState === null || gameState === null || currentUserState == null){
      return
    }
    setGameState(newGameState);
    const participants = gameState.participants;
    const participantsArray = participants !== null ? Array.from(participants) : []
    const currentGameUser = participantsArray.find((x: GameUser) => {
      return x !== null && x.userId !== null && currentUserState?.id !==null && x.userId.toString() === currentUserState?.id.toString()})
    if(currentGameUser !== undefined) {
      currentGameUser.currentState = newGameState
      setCurrentGameUser(currentGameUser)
    }
  }

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
      case WebsocketType.PLAYERUPDATE:
        const newUser: GameUser | null = structuredClone(currentGameUser);
        if (newUser !== null) {
          newUser.currentState = websocketPacket.payload;
        }
        setCurrentGameUser(newUser);
        break;
      case WebsocketType.POINTSUPDATE:
        setCurrentRoundPoints(payload);
    }
  };

  async function getCountry(): Promise<void> {
    try {
      const request = await api.get(`/games/${gameId}`);
      console.log("The request is: ", request);
      setCountryToGuess(request.data.currentCountry.name);
    } catch (error: AxiosError | any) {
      console.log("The Error was: ", error);
    }
  }

  let content = <Typography variant="h2">Loading...</Typography>;

  const userGameState =
    currentGameUser?.currentState !== undefined
      ? currentGameUser.currentState
      : undefined;
  const stateToCheck: GameState | any =
    userGameState !== gameState ? userGameState : gameState;


  switch (stateToCheck) {
    case GameState.SETUP:
      content = (
        <SetupComponent
          {...{
            allCountries: allCountries,
            game: game,
          }}
        />
      );
      break;
    case GameState.GUESSING:
      content = (
        <GuessingComponent
          {...{
            currentCountryHint: currentCountryHint,
            timeRemaining: timeRemaining,
            allCountries: allCountries,
            gameId: gameId,
            currentUser: currentUser,
            currentRoundPoints: currentRoundPoints,
          }}
        />
      );
      break;
    case GameState.SCOREBOARD:
      content = (
        <ScoreboardComponent
          {...{ currentUser: currentUser, gameId: gameId }}
        />
      );
      break;
    case GameState.ENDED:
      content = <EndedComponent />;
      break;
    case null:
      console.log("case 0");
      content = (
        <NotJoinedComponent
          gameId={gameId}
          setGameState={handleSetGameState}
        ></NotJoinedComponent>
      );
      break;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {content}
    </Container>
  );
};

export default GameLobby;
