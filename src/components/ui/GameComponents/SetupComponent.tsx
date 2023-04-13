import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormGroup,
  FormControl,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import GameGetDTO from "models/GameGetDTO";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {string} from "yup";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { type } from "os";



interface Props {
  gameGetDTO: GameGetDTO | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  //console.log("GuessingComponent props: ", props);
  const game = props.gameGetDTO;
  const [allLobbies, setAllLobbies] = useState<[GameGetDTO] | null>(null);
  //setAllLobbies(response.data);
  const userId = localStorage.getItem("userId");
  const url = window.location.href
  var gameID = game?.gameId;
  //console.log(" Players: ", game?.participants);
  const playerSet = game?.participants;
  //const playerArray = Array.from(playerSet);
  //console.log(" Player Array: ", playerArray);

  //let playerArray = Array.from( playerSet );






  console.log("url:")

  console.log(url)

  const [open, setOpen] = React.useState(false);
  const [openLink, setOpenLink] = React.useState(false);


  const handleTooltipCloseGameId = () => {
    setOpen(false);
  };

  const handleTooltipOpenGameId = () => {
    setOpen(true);
  };

  const handleTooltipCloseGameLink = () => {
    setOpenLink(false);
  };

  const handleTooltipOpenGameLink = () => {
    setOpenLink(true);
  };


  async function startGame(): Promise<void> {
    try {

      const request = await api.put(
        `/games/${game ? game.gameId : null}/start`,
        userId
      );
      const requestBody = request.data;
    } catch (error: AxiosError | any) {
      console.log(error);
    }
  }
  function createGameId() {

    if (game != null){
      if(game.gameId != undefined ){
        navigator.clipboard.writeText(game.gameId.toString())
      }
    }

  }
  const chipList = [
    { key: "1", label: "Hello" },
    { key: "2", label: "Elyas" }
  ];

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2">Game Lobby</Typography>
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
            <Typography variant="h5">You can share this game code, so your friends can join it. <Tooltip title="You can join a lobby using your code when clicking on the 'Join a lobby' button on the Dashboard or use the created link">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip></Typography>
            <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '20ch' },
                }}
                noValidate
                autoComplete="off"
            >
              <TextField disabled id="outlined-basic" color="primary" label="Game Id" variant="filled"  defaultValue={game?.gameId}/>
              <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipCloseGameId}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="Copied Game ID!"
              >
                <Button variant="contained" color="success" endIcon={<ContentCopyIcon />}
                        onClick={() => {createGameId();handleTooltipOpenGameId();}}
                >
                  Copy Game Id
                </Button>
              </Tooltip>

              <TextField disabled id="outlined-basic" color="secondary" label="Link" variant="filled"  defaultValue={url}/>
              <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipCloseGameLink}
                  open={openLink}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="Copied Game Link!"
              >
              <Button variant="contained" color="success" endIcon={<ContentCopyIcon />}
                      onClick={() => {navigator.clipboard.writeText(url); handleTooltipOpenGameLink();}}>
                Copy Game Link
              </Button>
              </Tooltip>

            </Box>
            <Typography variant="h2">Joined Players</Typography>
            <Typography variant="h4">Game Creator <Tooltip title="The game creator has set up the game and defined the settings">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip></Typography>
            <ul>
              <Stack direction="row" spacing={1}>
                <Chip
                    avatar={<Avatar alt="Natacha" src={"https://api.dicebear.com/6.x/pixel-art/svg?seed="+game?.lobbyCreator?.username}/>}
                    label={game?.lobbyCreator?.username}
                    variant="outlined"
                    color="success"
                />
              </Stack>
            </ul>
            <Typography variant="h4">All Players</Typography>
            <Typography variant="h5">gvvg</Typography>

            <ul>
              {chipList.map((data, index) => (
                  <Chip key={data.key + index} label={data.label} />
              ))}
            </ul>
            <ul>
              {playerSet.map((data, index) => (
                  <Chip key={data.key + index} label={data.label} />
              ))}
            </ul>
            <Typography variant="h2">Game Settings</Typography>
            <TextField
              id="round-seconds"
              label="Round Seconds"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={game?.roundDuration}
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
              value={game?.numberOfRounds}
              disabled={true}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={game?.openLobby ?? false}
                  disabled={true}
                  color="primary"
                />
              }
              label="Open Lobby"
            />
          </FormGroup>

          <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Selected Hints:</Typography>
            {game?.categoryStack?.selectedCategories ? (
              game?.categoryStack.selectedCategories.map((category, index) => (
                <Box key={index} sx={{ marginBottom: "1rem" }}>
                  <FormControl sx={{ minWidth: "200px" }}>
                    <TextField
                      id={`selected-category-${index}`}
                      label={`Selected Category ${index + 1}`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={category}
                      disabled={true}
                    />
                  </FormControl>
                </Box>
              ))
            ) : (
              <div></div>
            )}
          </FormControl>
        </DialogContent>
      </FormControl>
      <Button variant="outlined" onClick={() => startGame()}>
        Start Game
      </Button>
    </Container>
  );
};
export default GuessingComponent;
