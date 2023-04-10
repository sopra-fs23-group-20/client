import { Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

interface Props {}

const EndedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h2" sx={{ marginBottom: "2rem" }}>
        Game Over!
      </Typography>
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Thank you for playing.
      </Typography>
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        The final Scoreboard will be shown here.
      </Typography>
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
