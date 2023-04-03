import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import * as React from "react";
import { Switch } from "@mui/material";

import { TextField, DialogContent, FormControl } from "@mui/material";

interface Props {
  gameId: string | undefined;
}

const SetupComponent: React.FC<Props> = (props) => {
  const gameId = props.gameId;
  const [roundSeconds] = useState(30);
  const [randomizedHints] = useState(false);
  const [allCountries] = useState(false);
  const [numberOfRounds] = useState(1);
  const [openLobby] = useState(false);
  const [selectedHints] = useState({
    population: false,
    outline: false,
    flag: false,
    location: false,
    capital: false,
  });

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2">Game Settings</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "1rem",
        }}
      ></Box>
      <FormControl>
        <DialogContent>
          <FormControl sx={{ minWidth: "200px", marginBottom: "1rem" }}>
            <TextField
              id="round-seconds"
              label="Round Seconds"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={roundSeconds}
              disabled={true}
            />
          </FormControl>

          <FormGroup>
            <TextField
              id="number-of-rounds"
              label="Number of Rounds"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={numberOfRounds}
              disabled={true}
            />
            <FormControlLabel
              control={<Checkbox checked={randomizedHints} disabled={true} />}
              label="Randomized Hints"
            />
            <FormControlLabel
              control={<Checkbox checked={allCountries} disabled={true} />}
              label="All Countries"
            />
            <FormControlLabel
              control={
                <Switch checked={openLobby} disabled={true} color="primary" />
              }
              label="Open Lobby"
            />
          </FormGroup>

          <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Selected Hints:</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.population}
                    disabled={true}
                    name="population"
                  />
                }
                label="Population"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.outline}
                    disabled={true}
                    name="outline"
                  />
                }
                label="Outline"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.flag}
                    disabled={true}
                    name="flag"
                  />
                }
                label="Flag"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.location}
                    disabled={true}
                    name="location"
                  />
                }
                label="Location"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedHints.capital}
                    disabled={true}
                    name="capital"
                  />
                }
                label="Capital"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
      </FormControl>
    </Container>
  );
};

export default SetupComponent;
