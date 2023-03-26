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
import React, { useMemo } from "react";
import GuessingComponent from "components/ui/GameComponents/GuessingComponent";
import ScoreboardComponent from "components/ui/GameComponents/ScoreboardComponent";
import SetupComponent from "components/ui/GameComponents/SetupComponent";
import EndedComponent from "components/ui/GameComponents/EndedComponent";

const GameLobby: React.FC = () => {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(GameState.SETUP);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const isMounted = useRef(false);

  const [currentCountryHint, setCurrentCountryHint] = useState<Country>(
    new Country(null, null, null, null, null, null)
  );

  const gameStateMemo = useMemo(() => gameState, [gameState]);
  const timeRemainingMemo = useMemo(() => timeRemaining, [timeRemaining]);
  const currentCountryHintMemo = useMemo(
    () => currentCountryHint,
    [currentCountryHint]
  );

  const [countryToGuess, setCountryToGuess] = useState<String | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    if (!isMounted.current) {
      async function fetchData(): Promise<void> {
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
      fetchData();
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    const socket = new SockJS(websocketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = (frame) => {
      stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
        const messageBody = JSON.parse(message.body);
        console.log("Received a Message through websocket", messageBody);
        const websocketPacket = new WebsocketPacket(
          convertToWebsocketTypeEnum(messageBody.type),
          messageBody.payload
        );
        console.log("The saved Packet is: ", websocketPacket);
        switch (websocketPacket.type) {
          case WebsocketType.GAMESTATEUPDATE:
            if (websocketPacket.payload === "SCOREBOARD") {
              getCountry();
            }
            setGameState(convertToGameStateEnum(websocketPacket.payload));
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
          //
        }
      });
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/game/${gameId}/join`,
          body: "",
        });
      }
    };

    stompClient.onStompError = (frame) => {
      console.error(`Stomp error: ${frame}`);
    };

    stompClient.activate();

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/game/${gameId}/leave`,
          body: "",
        });
      }
      stompClient.deactivate();
    };
  }, [websocketUrl, gameId]);

  useEffect(() => {
    if (!isMounted.current) {
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
      fetchUser();
      isMounted.current = true;
    }
  }, []);

  async function getCountry(): Promise<void> {
    try {
      const request = await api.get(`/games/${gameId}`);
      console.log("The request is: ", request);
      setCountryToGuess(request.data.currentCountry.name);
    } catch (error: AxiosError | any) {
      console.log("The Error was: ", error);
    }
  }

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

  let content = <Typography variant="h2">Loading...</Typography>;

  switch (gameStateMemo) {
    case GameState.SETUP:
      content = <SetupComponent {...{ gameId: gameId }} />;
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
