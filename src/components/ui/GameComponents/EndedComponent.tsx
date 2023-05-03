import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  DialogActions,
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
import CircularProgressWithLabel from "helpers/CircularProgressWithLabel";
import getColorByTimeLeft from "helpers/getColorByTimeLeft";
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
  const timeProgress = normalise(gameGetDTO?.remainingTime, 10) / 100;
  const { showAlert } = useAlert();
  const [accordion1Expanded, setAccordion1Expanded] = useState(true);
  const [accordion2Expanded, setAccordion2Expanded] = useState(true);
  const [accordion3Expanded, setAccordion3Expanded] = useState(true);

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
      if (player.userPlayingAgain) {
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

  let playersNotPlayingAgain: GameUser[] = [];
  // eslint-disable-next-line eqeqeq
  if (playerSet != undefined) {
    playerSet.forEach((player) => {
      if (!player.userPlayingAgain) {
        playersNotPlayingAgain.push(player);
      }
    });
    playersNotPlayingAgain.sort((a, b) => {
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
        console.log("Game doesnt exist");
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
          variant="outlined"
          size="large"
          color="error"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={() => navigate("/game/")}
        >
          Back to Dashboard
        </Button>

        <Button
          size="large"
          sx={{ marginLeft: "3%", alignContent: "center" }}
          variant="outlined"
          onClick={playAgain}
        >
          Restart Game
        </Button>
      </Box>
      <Accordion
        sx={{ marginTop: "2%", borderRadius: "15px" }}
        expanded={accordion1Expanded}
        onChange={() => setAccordion1Expanded(!accordion1Expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Time Left to Restart Game</Typography>{" "}
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              {gameGetDTO?.remainingTime != null ? (
                <Typography variant="h4">
                  Time left to restart game:{" "}
                  {gameGetDTO.remainingTime.toString()}
                </Typography>
              ) : (
                <div></div>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <LinearProgress
                variant="determinate"
                value={timeProgress * 100}
                color={getColorByTimeLeft(
                  gameGetDTO.remainingTime,
                  gameGetDTO.timeBetweenRounds
                )}
                sx={{
                  flexGrow: 1,
                  marginLeft: "2%",
                }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ borderRadius: "15px" }}
        expanded={accordion2Expanded}
        onChange={() => setAccordion2Expanded(!accordion2Expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Players playing another Game</Typography>{" "}
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {playersPlayingAgain.map((data, index) => (
              <Chip
                avatar={
                  <Avatar
                    alt="Natacha"
                    src={
                      "https://api.dicebear.com/6.x/pixel-art/svg?seed=" +
                      data.username
                    }
                  />
                }
                key={data.userId}
                label={data.username}
              />
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ borderRadius: "15px" }}
        expanded={accordion3Expanded}
        onChange={() => setAccordion3Expanded(!accordion3Expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Players not playing another Game</Typography>{" "}
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {playersNotPlayingAgain.map((data, index) => (
              <Chip
                avatar={
                  <Avatar
                    alt="Natacha"
                    src={
                      "https://api.dicebear.com/6.x/pixel-art/svg?seed=" +
                      data.username
                    }
                  />
                }
                key={data.userId}
                label={data.username}
              />
            ))}
          </ul>
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
