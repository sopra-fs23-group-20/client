import React, { useState, useEffect, useCallback } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import {
  Button,
  Container,
  TextField,
  Typography,
  Tooltip,
  DialogActions,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InfoIcon from "@mui/icons-material/Info";
import GameGetDTO from "models/GameGetDTO";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LoginIcon from "@mui/icons-material/Login";
import RefreshIcon from "@mui/icons-material/Refresh";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
import GameUser from "models/GameUser";
import { useAlert } from "helpers/AlertContext";

//for snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GameLobbyOverview: React.FC = () => {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState<string | null>(null);
  const [allLobbies, setAllLobbies] = useState<[GameGetDTO] | null>(null);
  const [quickGame, setQuickGame] = useState<[GameGetDTO] | null>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleGameIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGameId(value);
    setIsButtonDisabled(value === "");
  };

  const { showAlert } = useAlert();

  const setToArray = (gameUsersSet: Set<GameUser> | null): GameUser[] => {
    if (!gameUsersSet) return [];
    return Array.from(gameUsersSet).sort((a, b) => {
      if (!a.username || !b.username) return 0;
      return a.username.localeCompare(b.username);
    });
  };

  const typewriterText = useTypewriter("Server List");

  //for snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const fetchLobbies = useCallback(async () => {
    try {
      const response = await api.get("/gamesplayable");
      setAllLobbies(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, [setAllLobbies]);
  const fetchquickjoin = useCallback(async () => {
    try {
      const response = await api.get("/bestgameavailable");
      navigate(`/game/lobby/` + response.data.gameId);
    } catch (error) {
      console.error("Error fetching countries:", error);
      showAlert("No game available!", "error");
      setOpen(true);
      await timeout(500);
      navigate(`/game/lobbies/`);
    }
  }, [setQuickGame]);

  useEffect(() => {
    void fetchLobbies();
  }, [fetchLobbies]);
  return (
    <Container
      sx={{
        marginTop: "10vh",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          minHeight: "56px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        {typewriterText}
      </Typography>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ mb: 4 }}
          variant="outlined"
          size="large"
          color="error"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={() => navigate("/game/")}
        >
          Back to Dashboard
        </Button>
      </DialogActions>

      <Typography sx={{ mb: 6, textAlign: "center" }} variant="h5">
        You can either use a code provided by a friend to join a specific lobby
        or you can choose a lobby from our list{" "}
      </Typography>

      <Typography sx={{ mb: 2 }} variant="h2">
        Join using a code
        <Tooltip
          title="You need a five digit code to join a specific game"
          placement="right"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        sx={{ mb: 2 }}
        id="filled-number"
        label="GameId"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        onChange={handleGameIdChange}
      />
      <Button
        sx={{ mt: 1.5, ml: 2 }}
        variant="contained"
        size="large"
        startIcon={<LoginIcon />}
        disabled={isButtonDisabled}
        onClick={() => (handleClick(), navigate(`/game/lobby/${gameId}`))}
      >
        Join game!
      </Button>
      <Typography
        sx={{ mb: 2, display: "flex", alignItems: "center" }}
        variant="h2"
      >
        {/* Your typography content */}
      </Typography>
      <Button
        sx={{ mb: 2 }}
        variant="contained"
        size="small"
        startIcon={<LoginIcon />}
        onClick={fetchquickjoin}
      >
        Quickjoin
      </Button>
      <Tooltip
        sx={{ mb: 2 }}
        title="You can directly join an available game by clicking on the button"
        placement="right"
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <TableContainer component={Paper}>
        <Typography variant="h2">Game Lobbies</Typography>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20%" }}>GameId</TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                Status
              </TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                Created by
              </TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                Number of Players
              </TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                Join the Game
              </TableCell>
            </TableRow>
          </TableHead>
          {allLobbies ? (
            <TableBody>
              {allLobbies.map((lobby, key) => {
                const playerArray = setToArray(lobby?.participants);
                return (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {lobby?.gameId}
                    </TableCell>
                    <TableCell align="center">{lobby?.currentState}</TableCell>
                    <TableCell align="center">
                      {lobby?.lobbyCreator?.username}
                    </TableCell>
                    <TableCell align="center">{playerArray.length}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="large"
                        variant="contained"
                        color="success"
                        endIcon={<SendIcon />}
                        onClick={() => navigate(`/game/lobby/${lobby?.gameId}`)}
                      >
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <div></div>
          )}
        </Table>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={() => fetchLobbies()}
        >
          Refresh!
        </Button>
      </TableContainer>
    </Container>
  );
};

export default GameLobbyOverview;
