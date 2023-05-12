import React, { useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
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
import { useAlert } from "helpers/AlertContext";
import Guess from "../../models/Guess";
import GameUser from "models/GameUser";
import CustomSpinner from "../ui/GameComponents/CustomSpinner";
import { Button } from "@mui/material";
// @ts-ignore
import earth from "./gif/Earth2.1.gif";

const GameLobby: React.FC = () => {
  const navigate = useNavigate();

  const [gameGetDTO, setGameGetDTO] = useState<GameGetDTO | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastGuess, setLastGuess] = useState<Guess | null>(null);
  const [leftGame, setLeftGame] = useState<boolean>(false);

  const [usePolling, setUsePolling] = useState(true);
  const usePollingRef = useRef(usePolling);
  const isFetching = useRef(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const gameId = window.location.pathname.split("/").pop();
  const currentUserId = localStorage.getItem("userId");

  const { showAlert } = useAlert();
  console.log("GameGetDTO: ", gameGetDTO);

  useEffect(() => {
    usePollingRef.current = usePolling;
  }, [usePolling]);

  function isUserInGame(
    userId: string | null,
    players: Set<GameUser> | null
  ): boolean {
    if (!userId || !players) return false;
    const parsedUserId = parseInt(userId, 10);

    for (const player of players) {
      if (player.userId === parsedUserId) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    async function fetchCountries(): Promise<void> {
      try {
        const response = await api.get("/games/" + gameId + "/countries");
        console.log("The response is: ", response);
        setAllCountries(response.data.sort());
      } catch (error: AxiosError | any) {
        navigate("/game");
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
        showAlert("Lobby doesn't exist", "error");
        navigate("/game");
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

    fetchGame();
    fetchCountries();
    fetchUser();
  }, []);

  useEffect(() => {
    async function joinLobby(): Promise<void> {
      try {
        if (
          gameGetDTO &&
          gameGetDTO?.currentState != GameState.SETUP &&
          !isUserInGame(currentUserId, gameGetDTO.participants)
        ) {
          showAlert(
            "Game cannot be joined since it has already started.",
            "error"
          );
          navigate("/");
        } else {
          let id = localStorage.getItem("userId");
          console.log("Joining lobby");
          const response = await api.post(
            `/games/${gameId}/join`,
            currentUserId
          );
          const newGameGetDTO: GameGetDTO = { ...response.data };
          console.log("Fetched Game : ", newGameGetDTO);
          setGameGetDTO(newGameGetDTO);
          console.log("Joined Lobby");
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (leftGame) {
      navigate("/");
    } else if (
      gameGetDTO &&
      gameGetDTO?.currentState === GameState.SETUP &&
      !isUserInGame(currentUserId, gameGetDTO.participants)
    ) {
      joinLobby();
    } else if (
      gameGetDTO &&
      gameGetDTO.currentState != GameState.SETUP &&
      !isUserInGame(currentUserId, gameGetDTO.participants)
    ) {
      showAlert("Game cannot be joined since it has already started.", "error");
      navigate("/");
    }
  }, [gameGetDTO, gameId]);

  async function leaveGame(): Promise<void> {
    try {
      console.log("Leaving game");
      setLeftGame(true);
      const response = await api.post(`/games/${gameId}/leave`, currentUserId);
      console.log("Left game");
      navigate("/game/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const websocketUrl = `${getDomain()}/socket`;
    const socket = new SockJS(websocketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 500,
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
  }, []);

  useEffect(() => {
    function playAgain(): void {
      if (!currentUserId || gameGetDTO?.participants == null) {
        return;
      }
      const userIdAsNumber = parseInt(currentUserId, 10);
      console.log("userIdAsNumber: ", userIdAsNumber);
      let userWantsToPlayAgain = false;

      gameGetDTO.participants.forEach((participant: GameUser) => {
        console.log("participant: ", participant.userPlayingAgain);
        if (participant.userPlayingAgain) {
          console.log("participant is playing again");
        }
        if (
          participant.userId === userIdAsNumber &&
          participant.userPlayingAgain
        ) {
          userWantsToPlayAgain = true;
        }
      });

      if (userWantsToPlayAgain) {
        console.log("In function playAgain");
        navigate(`/game/lobby/${gameGetDTO.nextGameId}`);
        window.location.reload();
      } else {
        console.log("User does not want to play again");
      }
    }

    if (
      gameGetDTO?.currentState == GameState.ENDED &&
      gameGetDTO?.nextGameId != null
    ) {
      playAgain();
    }
  }, [gameGetDTO]);

  function handleGameUpdate(message: IMessage): void {
    const messageObject = JSON.parse(message.body);
    const websocketPacket = new WebsocketPacket(
      messageObject.type,
      messageObject.payload
    );
    setGameGetDTO((prevGameGetDTO) => {
      const newGameGetDTO = updateGameGetDTO(prevGameGetDTO, websocketPacket);
      return newGameGetDTO;
    });
  }

  let content = <CustomSpinner />;

  if (gameGetDTO?.currentState == null) {
    return content;
  }

  switch (gameGetDTO.currentState) {
    case GameState.SETUP:
      content = (
        <SetupComponent
          {...{
            gameGetDTO: gameGetDTO,
          }}
        />
      );
      break;
    case GameState.GUESSING:
      content = (
        <GuessingComponent
          {...{
            gameGetDTO: gameGetDTO,
            allCountries: allCountries,
            currentUserId: currentUserId,
            setLastGuess: setLastGuess,
          }}
        />
      );
      break;
    case GameState.SCOREBOARD:
      content = (
        <ScoreboardComponent
          {...{
            currentUser: currentUser,
            gameId: gameId,
            gameGetDTO: gameGetDTO,
            isGameEnded: false,
            lastGuess: lastGuess,
          }}
        />
      );
      break;
    case GameState.ENDED:
      content = (
        <EndedComponent
          {...{
            currentUser: currentUser,
            gameId: gameId,
            gameGetDTO: gameGetDTO,
            lastGuess: lastGuess,
          }}
        />
      );
      break;
    case null:
      content = <NotJoinedComponent gameId={gameId}></NotJoinedComponent>;
      break;
    default:
      console.log("Unexpected game state:", gameGetDTO?.currentState);
      content = <div>Unexpected game state</div>;
      break;
  }

  const handleClickOpen = () => {
    if (
      gameGetDTO?.currentState === GameState.SETUP ||
      gameGetDTO?.currentState === GameState.ENDED
    ) {
      leaveGame();
    } else {
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container
      fixed
      sx={{
        marginTop: "1%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        <Button color="error" variant="outlined" onClick={handleClickOpen}>
          Leave Game
        </Button>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to leave the game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              leaveGame();
              handleClose();
            }}
          >
            Leave Game
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleClose}
            autoFocus
          >
            Keep Playing
          </Button>
        </DialogActions>
      </Dialog>
      {content}
    </Container>
  );
};

export default GameLobby;
