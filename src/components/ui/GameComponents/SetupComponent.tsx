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
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import GameGetDTO from "models/GameGetDTO";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { string } from "yup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import GameUser from "models/GameUser";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import {useNavigate} from "react-router-dom";
import { useQRCode } from 'next-qrcode';



interface Props {
  gameGetDTO: GameGetDTO | null;
}

const GuessingComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { Canvas } = useQRCode();
  //console.log("GuessingComponent props: ", props);
  const game = props.gameGetDTO;
  const [allLobbies, setAllLobbies] = useState<[GameGetDTO] | null>(null);
  //setAllLobbies(response.data);
  const userId = localStorage.getItem("userId");
  const url = window.location.href;
  const stringurl = url.toString();
  var gameID = game?.gameId;
  const [selectedRegions, setSelectedRegions] = useState({
    africa: false,
    asia: false,
    europe: false,
    america: false,
    oceania: false,
  });
  const playerSet = game?.participants;
  let playerArray: GameUser[] = [];
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
    } catch (error: AxiosError | any) {
      console.log(error);
    }
  }
  function createGameId() {
    if (game != null) {
      if (game.gameId != undefined) {
        navigator.clipboard.writeText(game.gameId.toString());
      }
    }
  }

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedRegions({
      ...selectedRegions,
      [name as keyof typeof selectedRegions]: checked,
    });
  };

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
      <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={() => navigate("/game/")}
      >
        Back to Dashboard
      </Button>
      <Typography align="left">
Here you can see an overview of the game you just joined and you can invite your friends.
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
                <Typography variant="h5">
                  Invite other players
                </Typography>              </AccordionSummary>
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
                      level: 'L',
                      margin: 2,
                      scale: 5,
                      width: 150,
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                    }}
                    logo={{
                      src: 'https://raw.githubusercontent.com/sopra-fs23-group-20/client/main/src/components/views/images/GTC-Logo.png',
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
                <Typography variant="h5">              Joined Players: {playerArray.length}{" "}
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
                  {game?.regionSet?.getRegions() ? (
                      game?.regionSet.getRegions().map((region, index) => (
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
      <Button variant="outlined" onClick={() => startGame()}>
        Start Game
      </Button>
    </Container>
  );
};
export default GuessingComponent;
