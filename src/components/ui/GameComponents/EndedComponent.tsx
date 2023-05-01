import { Button, Container, DialogActions, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ScoreboardComponent from "./ScoreboardComponent";
import User from "../../../models/User";
import GameGetDTO from "../../../models/GameGetDTO";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Guess from "../../../models/Guess";

interface Props {
  currentUser: User | null;
  gameId: string | undefined;
  gameGetDTO: GameGetDTO | null;
  lastGuess: Guess | null;
}

const EndedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const currentUser = props.currentUser;
  const gameId = props.gameId;
  const gameGetDTO = props.gameGetDTO;
  const lastGuess = props.lastGuess;

  if (gameId === null || gameGetDTO === null || currentUser === null) {
    return null;
  }

  return (
    <Container>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={() => navigate("/game/")}
        >
          Back to Dashboard
        </Button>
      </DialogActions>
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
