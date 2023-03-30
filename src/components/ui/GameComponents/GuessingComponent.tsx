import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";

interface Props {
  currentCountryHint: Country;
  timeRemaining: number;
  allCountries: Array<string>;
  gameId: string | undefined;
  currentUser: User | null;
  currentRoundPoints: number | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  const allCountries = props.allCountries;
  const currentCountryHint = props.currentCountryHint;
  const timeRemaining = props.timeRemaining;
  const gameId = props.gameId;
  const currentUser = props.currentUser;
  const currentRoundPoints = props.currentRoundPoints;


  const [valueEntered, setValueEntered] = useState<string | null>(null);

  async function submitGuess(): Promise<void> {
    try {
      console.log("Submitting guess", valueEntered);
      const request = await api.post(`/games/${gameId}/guesses`, {
        username: currentUser?.username,
        guess: valueEntered,
      });
      const requestBody = request.data;
      alert("Your guess was correct!");
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
    }
  }

  const formatNumber = (number: number): string => {
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return formattedNumber.replace(/,/g, "'");
  };

  return (
    <Container>
      <Typography variant="h2">You are now in a Game!</Typography>

      <Box sx={{ display: "flex", alignItems: "center", marginTop: 5 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allCountries}
          sx={{ width: 300 }}
          onChange={(event, value) => setValueEntered(value)}
          renderInput={(params) => (
            <TextField {...params} label="Enter your Guess here" />
          )}
        />

        {timeRemaining ? (
          <Typography variant="h4" sx={{ marginLeft: 5 }}>
            Time Remaining: {timeRemaining.toString()}{" "}
          </Typography>
        ) : (
          <div></div>
        )}


        {currentRoundPoints ? (
            <Typography variant="h4" sx={{ marginLeft: 5 }}>
              Current Round Points: {currentRoundPoints.toString()}{" "}
            </Typography>
        ) : (
            <div></div>
        )}


      </Box>

      <Button
        variant="outlined"
        sx={{ marginTop: 2 }}
        onClick={() => submitGuess()}
      >
        Submit your Guess
      </Button>

      <Box sx={{ height: 500, width: 500, marginTop: 10 }}>
        <HintComponent currentCountryHint={currentCountryHint} />
      </Box>
    </Container>
  );
};
export default GuessingComponent;
