import React, {useState, useEffect, useCallback} from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  Button,
  Container,
  TextField,
  Typography,
  Tooltip,
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

//for snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GameLobbyOverview: React.FC = () => {
  const navigate = useNavigate();

  const [GameId, setGameId] = useState<string | null>(null);
  const [allLobbies, setAllLobbies] = useState<[GameGetDTO] | null>(null);

  //for snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

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
      console.log("started fetching all games");
      const response = await api.get("/games");
      setAllLobbies(response.data);
      console.log("response:");
      console.log(response);

    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  },[setAllLobbies])

  useEffect(() => {
    void fetchLobbies();
  }, [fetchLobbies]);

  return (
    <Container>
      <Typography variant="h1">Game Lobbies</Typography>
      <Typography variant="h5">
        You can either use a code provided by a friend to join a specific lobby
        or you can choose a lobby from our list{" "}
      </Typography>

      <Typography variant="h2">
        Join using a code
        <Tooltip
          title="You need a three digit code to join a specific game"
          placement="top"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        id="filled-number"
        label="GameId"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        onChange={(e) => setGameId(e.target.value)}
      />
      <Button
        variant="contained"
        // eslint-disable-next-line no-sequences
        onClick={() => (handleClick(), navigate(`/game/lobby/${GameId}`))}
      >
        Join game!
      </Button>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Joined Lobby!
          </Alert>
        </Snackbar>
      </Stack>

      <TableContainer component={Paper}>
        <Typography variant="h2">Game Lobbies</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>GameId</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Created by</TableCell>
              <TableCell align="right">Join the Game</TableCell>
            </TableRow>
          </TableHead>
          {allLobbies ? (
            <TableBody>
              {allLobbies.map((lobby, key) => (
                <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {lobby?.gameId}
                  </TableCell>
                  <TableCell align="right">{lobby?.currentState}</TableCell>
                  <TableCell align="right">
                    {lobby?.lobbyCreator?.username}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<SendIcon />}
                      onClick={() => navigate(`/game/lobby/${lobby?.gameId}`)}
                    >
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <div></div>
          )}
        </Table>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            This is a success message!
          </Alert>
        </Snackbar>
        <Chip label="Refresh!" onClick={fetchLobbies} />
      </TableContainer>
      <Button variant="outlined" onClick={() => navigate(`/game/`)}>
        Back to Main
      </Button>
    </Container>
  );
};

export default GameLobbyOverview;
