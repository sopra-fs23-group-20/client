import { Box, Button, Grid, Typography } from "@mui/material";
import GameGetDTO from "models/GameGetDTO";
import React from "react";

interface ButtonSelectionProps {
  gameGetDTO: GameGetDTO | null;
  submitGuess: (countryGuess: string | null) => Promise<void>;
  hasPlayerGuessed: () => boolean;
}

export const ButtonSelection: React.FC<ButtonSelectionProps> = (props) => {
  const game = props.gameGetDTO;
  const submitGuess = props.submitGuess;
  const hasPlayerGuessed = props.hasPlayerGuessed;
  const colors = [
    "#5EB23F",
    "#00A162",
    "#008D78",
    "#00767D",
    "#005F71",
    "#2F4858",
  ];

  if (game == null) {
    return <div></div>;
  }
  return (
    <Box
      sx={{
        marginTop: "5%",
        marginBottom: "5%",
      }}
    >
      <Box>
        <Typography variant="h4" align="center" sx={{ marginBottom: "1rem" }}>
          Select the right Country!
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          {game?.categoryStack?.closestCountries?.map(
            (countryName, index: number) => (
              <Grid key={index} item xs="auto">
                <Button
                  disabled={hasPlayerGuessed()}
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ background: colors[index] }}
                  onClick={() => submitGuess(countryName)}
                >
                  {countryName}
                </Button>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ButtonSelection;
