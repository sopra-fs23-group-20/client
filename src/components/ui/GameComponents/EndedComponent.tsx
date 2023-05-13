import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScoreboardComponent from "./ScoreboardComponent";
import User from "../../../models/User";
import GameGetDTO from "../../../models/GameGetDTO";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Guess from "../../../models/Guess";
import { api } from "helpers/api";
import GameUser from "models/GameUser";
import GameState from "models/constant/GameState";
import { useAlert } from "helpers/AlertContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  currentUser: User | null;
  gameId: string | undefined;
  gameGetDTO: GameGetDTO | null;
  lastGuess: Guess | null;
}

const normalise = (
  value: number | null | undefined,
  max: number | null | undefined
) => {
  if (value == null || max == null) return 0;
  return (value * 100) / max;
};

const EndedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const currentUser = props.currentUser;
  const gameId = props.gameId;
  const gameGetDTO = props.gameGetDTO;
  const lastGuess = props.lastGuess;
  const userId = localStorage.getItem("userId");
  const timeProgress = normalise(gameGetDTO?.remainingTime, 30) / 100;
  const { showAlert } = useAlert();
  const [accordion2Expanded, setAccordion2Expanded] = useState(true);

  let currentRound = 0;
  if (
    gameGetDTO?.numberOfRounds != null &&
    gameGetDTO.remainingRounds != null
  ) {
    currentRound = gameGetDTO?.numberOfRounds - gameGetDTO?.remainingRounds;
  }

  if (gameId === null || gameGetDTO === null || currentUser === null) {
    return null;
  }

  const playerSet = gameGetDTO?.participants;
  let playersPlayingAgain: GameUser[] = [];
  // eslint-disable-next-line eqeqeq
  if (playerSet != undefined) {
    playerSet.forEach((player) => {
      if (player.userPlayingAgain && !player.hasLeft) {
        playersPlayingAgain.push(player);
      }
    });
    playersPlayingAgain.sort((a, b) => {
      if (a.username == null || b.username == null) return 0;
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    });
  }

  let playersLeftGame: GameUser[] = [];
  // eslint-disable-next-line eqeqeq
  if (playerSet != undefined) {
    playerSet.forEach((player) => {
      if (player.hasLeft) {
        playersLeftGame.push(player);
      }
    });
    playersLeftGame.sort((a, b) => {
      if (a.username == null || b.username == null) return 0;
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    });
  }

  let playersUndecided: GameUser[] = [];
  // eslint-disable-next-line eqeqeq
  if (playerSet != undefined) {
    playerSet.forEach((player) => {
      if (!player.hasLeft && !player.userPlayingAgain) {
        playersUndecided.push(player);
      }
    });
    playersLeftGame.sort((a, b) => {
      if (a.username == null || b.username == null) return 0;
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    });
  }

  async function playAgain(): Promise<void> {
    if (gameGetDTO?.remainingTime != 0) {
      try {
        await api.post(`/games/${gameId}/restart`, userId);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await api.get(`/games/${gameGetDTO.nextGameId}`);
        const game: GameGetDTO = { ...response.data };
        if (game == null) {
          console.log("Game doesn't exist");
          showAlert("Cannot join, Game doesn't exist", "error");
          return;
        }
        if (game.currentState === GameState.SETUP) {
          navigate(`/game/lobby/${game.gameId}`);
          window.location.reload();
        } else {
          showAlert("Cannot join, Game is already started", "error");
        }
      } catch (error) {
        console.log("Game doesn't exist");
        showAlert("Cannot join, Game doesn't exist", "error");
      }
    }
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Button
          sx={{
            alignContent: "center",
            position: "relative",
          }}
          variant="outlined"
          onClick={playAgain}
        >
          {timeProgress > 0 && (
            <LinearProgress
              variant="query"
              value={timeProgress * 100}
              color="info"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${timeProgress * 100}%`,
                maxWidth: "100%",
                height: "100%",
                borderRadius: "inherit",
              }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1 }}>Restart Game</span>
        </Button>
      </Box>
      <Accordion
        sx={{ borderRadius: "15px", mt: 2 }}
        expanded={accordion2Expanded}
        onChange={() => setAccordion2Expanded(!accordion2Expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Players</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <AccordionDetails>
            <Typography variant="h6">Players Left</Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {playersLeftGame.map((data) => (
                <li
                  key={data.userId}
                  style={{
                    margin: "0.5rem",
                  }}
                >
                  <Chip
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${data.username}`}
                      />
                    }
                    label={data.username}
                  />
                </li>
              ))}
            </ul>
          </AccordionDetails>
          <AccordionDetails>
            <Typography variant="h6">Players Undecided</Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {playersUndecided.map((data) => (
                <li
                  key={data.userId}
                  style={{
                    margin: "0.5rem",
                  }}
                >
                  <Chip
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${data.username}`}
                      />
                    }
                    label={data.username}
                  />
                </li>
              ))}
            </ul>
          </AccordionDetails>
          <AccordionDetails>
            <Typography variant="h6">Playing Again</Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {playersPlayingAgain.map((data) => (
                <li
                  key={data.userId}
                  style={{
                    margin: "0.5rem",
                  }}
                >
                  <Chip
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${data.username}`}
                      />
                    }
                    label={data.username}
                  />
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </AccordionDetails>
      </Accordion>

      <ScoreboardComponent
        currentUser={currentUser}
        gameId={gameId}
        gameGetDTO={gameGetDTO}
        isGameEnded={true}
        lastGuess={lastGuess}
      />
    </Container>
  );
};

export default EndedComponent;

function showAlert(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
