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
import {convertToGameStateEnum, convertToWebsocketTypeEnum} from '../../helpers/convertTypes'

const GameLobby: React.FC = () => {
  const socket = useWebSocket();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [countryToGuess, setCountryToGuess] = useState<String | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const gameId = window.location.pathname.split("/").pop();
  const websocketUrl = `${getDomain()}/game/${gameId}`;

  async function fetchGame(): Promise<void> {
    try {
      const response = await api.get(`/games/${gameId}`, {
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
      });
      console.log("The response is: ", response);
      const currentState = convertToGameStateEnum(response.data.currentState)
      setGame( {...response.data, currentState});
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await api.get("/games/" + gameId + "/countries");
        console.log("The response is: ", response);
        setAllCountries( response.data);
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
        const response = await api.post(`/games/${gameId}/join`, id);
        console.log("Joined Lobby");
      } catch (error) {
        console.error(error);
      }
    }

    async function setStates(): Promise<void> {
      await fetchData();
      await fetchGame();
      await fetchUser();
      await joinLobby()
    }
    setStates()
  }, [gameId]);

  useEffect(() => {
    if(game !== null && currentUser !== null){
      handleSetGameState(game.currentState)
    }
  }, [currentUser])

  useEffect(() => {
    if (socket && game !== null && currentUser !== null) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket, game, currentUser]);

  const handleSetGameState = (newGameState: GameState|null, gameObject: Game|null = game, currentUserObject: User|null=currentUser, onlyPlayer=false) => {
    if (newGameState === null || gameObject === null || currentUserObject == null){
      return
    }
    const newGame: Game = structuredClone(gameObject)
    if(!onlyPlayer){
      newGame.currentState = newGameState
    }
    const participants = newGame.participants;
    const participantsArray = participants !== null ? Array.from(participants) : []
    newGame.participants = new Set(participantsArray.map((x: GameUser) => {
      const isCurrentUser = x !== null && x.userId !== null && currentUserObject?.id !== null && x.userId.toString() === currentUserObject?.id.toString()
      if (isCurrentUser) {
        const adaptedUser = structuredClone(x)
        adaptedUser.currentState = newGameState
        return adaptedUser
      }
      return x
    }))
    setGame(newGame)
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

      case WebsocketType.PLAYERUPDATE:
        if(game !== null){
          const gameState = convertToGameStateEnum(websocketPacket.payload)
          handleSetGameState(gameState, game,currentUser)
        }
        break;
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

  if (game !== null && game.participants !== null && currentUser !== null) {
    const gameState = game.currentState;
    const currentGameUser = Array.from(game.participants).find((x: GameUser) => x.userId !== null && currentUser.id !== null && x.userId.toString() === currentUser.id.toString())
    const userGameState =
        currentGameUser?.currentState !== undefined
            ? currentGameUser.currentState
            : undefined;
    const stateToCheck: GameState | any =
        userGameState !== game?.currentState ? userGameState : gameState;


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
                  allCountries: allCountries,
                  gameId: gameId,
                  currentUser: currentUser,
                }}
            />
        );
        break;
      case GameState.SCOREBOARD:
        content = (
            <ScoreboardComponent
                {...{currentUser: currentUser, gameId: gameId}}
            />
        );
        break;
      case GameState.ENDED:
        content = <EndedComponent/>;
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
