import WinnerOverviewComponent from "./WinnerOverviewComponent";
import User from "../../../models/User";
import GameGetDTO from "../../../models/GameGetDTO";
import React, { useEffect, useState, ReactNode } from "react";
import { Button, Typography } from "@mui/material";
import { api } from "../../../helpers/api";
import GameUser from "../../../models/GameUser";
import { Link, useNavigate } from "react-router-dom";
import Guess from "../../../models/Guess";

interface Props {
  currentUser: User | null;
  gameId: string | undefined;
  gameGetDTO: GameGetDTO | null;
  isGameEnded: boolean;
  lastGuess: Guess | null;
  children?: ReactNode;
}

const ScoreboardComponent: React.FC<Props> = (props) => {
  const { isGameEnded, currentUser, gameId, gameGetDTO, lastGuess } = props;
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [winnerUpdated, setWinnerUpdated] = useState(false);
  const navigate = useNavigate();

  const informServerLeave = async (isLobbyCreator: boolean) => {
    try {
      const response = await api.put(
        `/games/${gameId}/action?action=leave`,
        { isLobbyCreator },
        {
          headers: { Authorization: localStorage.getItem("token")! },
        }
      );

      if (response.data.gameDeleted) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayAgain = async () => {
    try {
      if (
        currentUser &&
        gameGetDTO &&
        gameGetDTO.lobbyCreator &&
        gameGetDTO.lobbyCreator.userId &&
        currentUser.id === gameGetDTO.lobbyCreator.userId
      ) {
        await api.put(
          `/games/${gameId}/action?action=restart&userId=${currentUser.id}`,
          { userId: currentUser.id },
          {
            headers: { Authorization: localStorage.getItem("token")! },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderButtons = () => {
    if (isGameEnded) {
      return (
        <div className="ButtonContainer">
          <Button onClick={handlePlayAgain}>Play Again</Button>
          <Button onClick={handleLeave}>Leave</Button>
        </div>
      );
    }
  };

  const handleLeave = async () => {
    try {
      const isLobbyCreator = !!(
        currentUser &&
        gameGetDTO &&
        gameGetDTO.lobbyCreator &&
        currentUser.id === gameGetDTO.lobbyCreator.userId
      );
      await informServerLeave(isLobbyCreator);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCurrentCountry = async () => {
      try {
        const response = await api.get(`/games/${gameId}/country`);
        const country = response.data;
        setCurrentCountry(country);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentCountry().then((r) => r);
  }, [gameId]);

  useEffect(() => {
    if (
      isGameEnded &&
      gameGetDTO !== null &&
      gameGetDTO.participants !== null
    ) {
      const participantsArray = Array.from(gameGetDTO.participants);
      const sortedParticipants = sortParticipantsByScore(participantsArray);
      const winner = sortedParticipants[0];
      const isDraw =
        winner &&
        sortedParticipants[1] &&
        winner.gamePoints === sortedParticipants[1].gamePoints;
      const onlyLobbyCreator = participantsArray.length === 1;
      if (
        winner &&
        winner.userId &&
        !winnerUpdated &&
        !onlyLobbyCreator &&
        !isDraw
      ) {
        updateWinnerGamesWon(winner.userId);
        setWinnerUpdated(true);
      }
    }
  }, [isGameEnded, winnerUpdated, gameGetDTO]);

  const updateWinnerGamesWon = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: localStorage.getItem("token")! },
      });
      const userData = response.data;
      console.log(userData);

      const currentGamesWon = userData.gamesWon || 0;
      const updatedGamesWon = currentGamesWon + 1;

      const requestBody = {
        gamesWon: updatedGamesWon,
      };

      await api.put(`/users/${userId}`, requestBody, {
        headers: { Authorization: localStorage.getItem("token")! },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (currentUser === null || gameGetDTO === null) {
    return null;
  }

  const participants: Set<GameUser> | null = gameGetDTO.participants;

  if (participants === null) {
    return null;
  }

  const participantsArray = Array.from(participants);

  const getGameUser = (user: User) =>
    participantsArray.find((x: GameUser) => {
      return (
        x.userId !== null &&
        user?.id !== null &&
        x["userId"].toString() === user?.id.toString()
      );
    });

  const currentGameUser = getGameUser(currentUser);

  const sortParticipantsByScore = (participantsArray: GameUser[]) => {
    return participantsArray.sort((a, b) => {
      if (
        a.gamePoints === null ||
        b.gamePoints === null ||
        a.username === null ||
        b.username === null
      ) {
        return 0;
      }
      if (Math.abs(b.gamePoints - a.gamePoints) < Math.pow(10, -6)) {
        return a.username > b.username ? 1 : -1;
      }
      return b.gamePoints - a.gamePoints;
    });
  };

  const sortedParticipantsByScore = sortParticipantsByScore(participantsArray);

  const renderPlayerUsernameTableCell = (player: any) => {
    return isGameEnded ? (
      <Link to={`/game/profile/${player.userId}`}>{player.username}</Link>
    ) : (
      <>{player.username}</>
    );
  };
  const getPlayerGamePoints: any = (gameUser: GameUser) => {
    if (
      gameUser.userId === null ||
      currentGameUser === undefined ||
      currentGameUser.userId === null ||
      gameGetDTO.remainingRoundPoints === null ||
      gameUser.gamePoints === null ||
      gameUser.currentState === null
    ) {
      return null;
    }

    return gameUser.gamePoints;
  };

  const renderTitle = () => (
    <h1 className="Title">
      {" "}
      {isGameEnded ? "Final Scoreboard" : "Scoreboard"}
    </h1>
  );

  const renderAdditionalInformation = () => (
    <>
      {isGameEnded && (
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          The correct country was: {currentCountry}
        </Typography>
      )}
      {lastGuess !== null && (
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Your last guess was: {lastGuess.guess}
        </Typography>
      )}
      {!isGameEnded && (
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Next round starts in:{" "}
          {gameGetDTO ? gameGetDTO.remainingTime : "undefined"}
        </Typography>
      )}
    </>
  );

  const renderInformationOnBottom = () => {
    if (isGameEnded) {
      return undefined;
    }
    return (
      <Typography variant="h4" sx={{ marginTop: 5 }}>
        Currently on Round:{" "}
        {gameGetDTO?.numberOfRounds != null &&
        gameGetDTO?.remainingRounds != null
          ? gameGetDTO.numberOfRounds -
            gameGetDTO.remainingRounds +
            "/" +
            gameGetDTO.numberOfRounds
          : undefined}
      </Typography>
    );
  };

  return (
    <WinnerOverviewComponent
      renderTitle={renderTitle}
      currentUserId={currentUser.id}
      renderAdditionalInformation={renderAdditionalInformation}
      sortedParticipantsByScore={sortedParticipantsByScore}
      attributeToConsider={"gamePoints"}
      additionalText={"points"}
      renderPlayerValue={getPlayerGamePoints}
      renderPlayerUsernameTableCell={renderPlayerUsernameTableCell}
      renderInformationOnBottom={renderInformationOnBottom}
      idAttributeName={"userId"}
      columnHeaderText={"Points"}
    >
      {renderButtons()}
    </WinnerOverviewComponent>
  );
};

export default ScoreboardComponent;
