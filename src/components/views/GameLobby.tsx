import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import User from "models/User";
import React from "react";
import { AxiosError } from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import GameInfo from "models/GameInfo";
import GameState from "models/GameState";
import CountryContainer from "components/ui/CountryContainer";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";

const GameLobby: React.FC = () => {
  const history = useHistory();

  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const gameId = window.location.pathname.split("/").pop();
  const websocketUrl = `${getDomain()}/game/${gameId}`;

  useEffect(() => {
    const socket = new SockJS(websocketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = (frame) => {
      stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
        const gameStateUpdate = JSON.parse(message.body);

        const gameInf = new GameInfo({
          id: gameStateUpdate.id,
          time: gameStateUpdate.time,
          currentCountry: gameStateUpdate.currentCountry,
          currentPopulation: gameStateUpdate.currentPopulation,
          gameState: gameStateUpdate.gameState,
          creatorUsername: gameStateUpdate.creatorUsername,
          currentFlag: gameStateUpdate.currentFlag,
          currentLongitude: gameStateUpdate.currentLongitude,
          currentLatitude: gameStateUpdate.currentLatitude,
        });
        setGameInfo(gameStateUpdate);
        console.log(gameInfo);
      });

      stompClient.publish({
        destination: `/game/${gameId}/join`,
        body: "",
      });
    };

    stompClient.onStompError = (frame) => {
      console.error(`Stomp error: ${frame}`);
    };

    stompClient.activate();

    return () => {
      stompClient.publish({
        destination: `/game/${gameId}/leave`,
        body: "",
      });
      stompClient.deactivate();
    };
  }, [websocketUrl, gameId]);

  async function startGame(): Promise<void> {
    try {
      await api.put(`/games/${gameId}/start`);
    } catch (error: AxiosError | any) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
    }
  }

  async function getStatsManually(): Promise<void> {
    try {
      const request = await api.get(`/games/${gameId}`);
      const gameStateUpdate = request.data;

      const gameInf = new GameInfo({
        id: gameStateUpdate.id,
        time: gameStateUpdate.time,
        currentCountry: gameStateUpdate.currentCountry,
        currentPopulation: gameStateUpdate.currentPopulation,
        gameState: gameStateUpdate.gameState,
        creatorUsername: gameStateUpdate.creatorUsername,
        currentFlag: gameStateUpdate.currentFlag,
        currentLongitude: gameStateUpdate.currentLongitude,
        currentLatitude: gameStateUpdate.currentLatitude,
      });
      setGameInfo(gameStateUpdate);
      console.log(gameInfo);
    } catch (error: AxiosError | any) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`
      );
    }
  }

  if (gameInfo?.gameState) {
    const country = new Country({
      name: gameInfo.currentCountry ?? "",
      population: gameInfo.currentPopulation ?? 0,
      flag: gameInfo.currentFlag ?? "",
      longitude: gameInfo.currentLongitude ?? 0,
      latitude: gameInfo.currentLatitude ?? 0,
    });
    console.log(country);

    console.log(typeof gameInfo.gameState);
    switch (gameInfo?.gameState) {
      case "SETUP":
        return (
          <BaseContainer>
            <div>
              <h1>You are now in a Game!</h1>
            </div>
            <button onClick={() => startGame()}>Start Game</button>
          </BaseContainer>
        );
      case "GUESSING":
        return (
          <BaseContainer>
            <div>
              <h1>You are now in a Game!</h1>

              <h2>Time remaining: {gameInfo?.time}</h2>
            </div>
            <CountryContainer {...country} />
            <div></div>
          </BaseContainer>
        );
      case "SCOREBOARD":
        return (
          <BaseContainer>
            <div>
              <h1>Game Lobby ID: {gameInfo?.id}</h1>
              <h2>Now the Scoreboard should be shown</h2>
            </div>
          </BaseContainer>
        );
    }
  } else {
    getStatsManually();
  }

  return (
    <BaseContainer>
      <div>
        <h1>Loading</h1>
      </div>
    </BaseContainer>
  );
};

export default GameLobby;
