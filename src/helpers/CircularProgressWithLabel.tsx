import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface CircularProgressWithLabelProps {
  value: number;
  currentRound: number;
  numberOfRounds: number | null | undefined;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = (
  props
) => {
  const { value, currentRound, numberOfRounds } = props;

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="h4" component="div" color="text.secondary" mr={1}>
        Round:
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={value} />
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        >
          <Typography variant="h6" component="div" color="text.secondary">
            {currentRound + "/" + numberOfRounds}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
