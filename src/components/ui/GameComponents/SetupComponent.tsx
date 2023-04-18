import { api } from "helpers/api";
import {
  Button,
  Container,
  Typography,
  Box,
  FormGroup,
  FormControl,
  DialogContent,
  FormControlLabel,
  Switch,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from "axios";
import { TextField } from "@mui/material";
import React from "react";
import GameGetDTO from "models/GameGetDTO";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GameUser from "models/GameUser";

interface Props {
  gameGetDTO: GameGetDTO | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  //console.log("GuessingComponent props: ", props);
  const game = props.gameGetDTO;
  const userId = localStorage.getItem("userId");
  const url = window.location.href;
  const playerSet = game?.participants;
  let playerArray: GameUser[] = [];
  // eslint-disable-next-line eqeqeq
  if (playerSet != undefined) {
    playerArray = Array.from(playerSet);
    playerArray.sort((a, b) => {
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

  console.log("url:");

  console.log(url);

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
      console.log(requestBody);
    } catch (error: AxiosError | any) {
      console.log(error);
    }
  }
  function createGameId() {
    if (game != null) {
      // eslint-disable-next-line eqeqeq
      if (game.gameId != undefined) {
        navigator.clipboard.writeText(game.gameId.toString());
      }
    }
  }

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
            <Typography variant="h5">
              You can share this game code, so your friends can join it.{" "}
              <Tooltip title="You can join a lobby using your code when clicking on the 'Join a lobby' button on the Dashboard or use the created link">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "20ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                disabled
                id="outlined-basic"
                color="primary"
                label="Game Id"
                variant="filled"
                defaultValue={game?.gameId}
              />
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
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ContentCopyIcon />}
                  onClick={() => {
                    createGameId();
                    handleTooltipOpenGameId();
                  }}
                >
                  Copy Game Id
                </Button>
              </Tooltip>

              <TextField
                disabled
                id="outlined-basic"
                color="secondary"
                label="Link"
                variant="filled"
                defaultValue={url}
              />
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
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ContentCopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    handleTooltipOpenGameLink();
                  }}
                >
                  Copy Game Link
                </Button>
              </Tooltip>
            </Box>
            <Typography variant="h2">
              Joined Players: {playerArray.length}{" "}
            </Typography>
            <Typography variant="h4">
              Game Creator{" "}
              <Tooltip title="The game creator has set up the game and defined the settings">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <ul>
              <Stack direction="row" spacing={1}>
                <Chip
                  avatar={
                    <Avatar
                      alt="Natacha"
                      src={
                        "https://api.dicebear.com/6.x/pixel-art/svg?seed=" +
                        game?.lobbyCreator?.username
                      }
                    />
                  }
                  label={game?.lobbyCreator?.username}
                  variant="outlined"
                  color="success"
                />
              </Stack>
            </ul>
            <Typography variant="h4">All Players</Typography>

            <ul>
              {playerArray.map((data, index) => (
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
                  sx={{ marginLeft: 2 }}
                />
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
          <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Selected Regions:</Typography>
            {game?.selectedRegions ? (
              [...game.selectedRegions].map((region, index) => (
                <Box key={index} sx={{ marginBottom: "1rem" }}>
                  <FormControl sx={{ minWidth: "200px" }}>
                    <TextField
                      id={`selected-region-${index}`}
                      label={`Selected Region ${index + 1}`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={region}
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
