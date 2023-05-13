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
  DialogActions,
  Grid,
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import { useQRCode } from "next-qrcode";
import { Difficulty } from "models/constant/Difficulty";

interface Props {
  gameGetDTO: GameGetDTO | null;
}

const SetupComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { Canvas } = useQRCode();
  const game = props.gameGetDTO;
  const userId = localStorage.getItem("userId");
  const url = window.location.href;
  const stringurl = url.toString();
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

      <Typography align="left">
        Here you can see an overview of the game you just joined and you can
        invite your friends.
      </Typography>
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
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Invite other players</Typography>{" "}
              </AccordionSummary>
              <AccordionDetails>
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
                <Typography>
                  QR Code
                  <Tooltip title="Your friends can scan this code using a smartphone">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Canvas
                  text={stringurl}
                  options={{
                    level: "L",
                    margin: 2,
                    scale: 5,
                    width: 150,
                    color: {
                      dark: "#000000",
                      light: "#ffffff",
                    },
                  }}
                  logo={{
                    src: "https://raw.githubusercontent.com/sopra-fs23-group-20/client/main/src/components/views/images/GTC-Logo.png",
                    options: {
                      width: 35,
                      x: undefined,
                      y: undefined,
                    },
                  }}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">
                  {" "}
                  Joined Players: {playerArray.length}{" "}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Game Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid item container spacing={2} sx={{ width: "50%" }}>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="game-mode"
                        label="Game Mode"
                        value={game?.gameMode?.toString()}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="difficulty-level"
                        label="Difficulty"
                        value={game?.difficulty?.toString()}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="number-guesses"
                        label="Number of Guesses"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={game?.numberOfGuesses}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="number-of-rounds"
                        label="Number of Rounds"
                        type="number"
                        value={game?.numberOfRounds}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="seconds-to-guess"
                        label="Seconds to Guess"
                        type="number"
                        value={game?.roundDuration}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <TextField
                        id="time-between-rounds"
                        label="Time Between Rounds"
                        type="number"
                        value={game?.timeBetweenRounds}
                        disabled={true}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl>
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                game?.categoryStack?.randomizedHints ?? false
                              }
                              disabled={true}
                              color="primary"
                            />
                          }
                          label="Randomized Hints"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
                  <Typography
                    sx={{ marginBottom: 2, marginRight: "1rem" }}
                    variant="h4"
                  >
                    Selected Hints:
                  </Typography>
                  {game?.categoryStack?.selectedCategories ? (
                    game?.categoryStack.selectedCategories.map(
                      (category, index) => (
                        <Box
                          key={index}
                          sx={{ marginBottom: "1rem", marginRight: "1rem" }}
                        >
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
                      )
                    )
                  ) : (
                    <div></div>
                  )}
                </FormControl>
                <FormControl component="fieldset" sx={{ marginTop: "1rem" }}>
                  <Typography sx={{ marginBottom: 2 }} variant="h4">
                    Selected Regions:
                  </Typography>
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
              </AccordionDetails>
            </Accordion>
          </FormControl>
        </DialogContent>
      </FormControl>
      {parseInt(userId ?? "0") === game?.lobbyCreator?.userId ? (
        <Button sx={{ mb: 4 }} variant="outlined" onClick={() => startGame()}>
          Start Game
        </Button>
      ) : (
        <Typography variant="h5">
          Please wait for the lobby creator to start the game.
        </Typography>
      )}
    </Container>
  );
};
export default SetupComponent;
