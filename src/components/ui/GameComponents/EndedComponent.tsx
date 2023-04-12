import { Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ScoreboardComponent from "./ScoreboardComponent";
import User from "../../../models/User";
import GameGetDTO from "../../../models/GameGetDTO";

interface Props {
    currentUser: User | null;
    gameId: string | undefined ;
    gameGetDTO: GameGetDTO | null;
}

const EndedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
    const currentUser = props.currentUser;
    const gameId = props.gameId;
    const gameGetDTO = props.gameGetDTO;

    if(gameId === null || gameGetDTO === null || currentUser === null){
        return null
    }

  return (
    <Container>
      <Typography variant="h2" sx={{ marginBottom: "2rem" }}>
        Game Over!
      </Typography>
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Thank you for playing.
      </Typography>
        <ScoreboardComponent currentUser={currentUser} gameId={gameId} gameGetDTO={gameGetDTO} isGameEnded={true}/>
      <Button
        variant="contained"
        onClick={(e) => navigate("/game")}
        sx={{ marginTop: "2rem" }}
      >
        Back to Mainpage
      </Button>
    </Container>
  );
};

export default EndedComponent;
