import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Avatar,
  Input,
  Tooltip,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { AxiosError } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import InfoIcon from "@mui/icons-material/Info";
import GameGetDTO from "models/GameGetDTO";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
//for snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GameLobbyOverview: React.FC = () => {
  const id = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [GameId, setGameId] = useState<string | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [nationality, setNationality] = useState<string | null>(null);
  const [gamesWon, setGamesWon] = useState<number | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);
  //if new attribute is need from allLobbies: define it like gameId
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

  // Save user changes
  const saveChanges = async () => {
    try {
      console.log("Updating User");
      let requestBody = {
        username: username,
        password: password,
        birthday: birthday,
        nationality: nationality,
        profilePicture: profilePicture,
        status: "ONLINE",
      };
      console.log(" The Request Body is: ", requestBody);
      const response = await api.put(`/users/${id}`, requestBody, {
        headers: { Authorization: localStorage.getItem("token")! },
      });

      setEditMode(false);
      const copyCurrentUser = { ...currentUser! };
      copyCurrentUser.username = username!;
      copyCurrentUser.password = password!;
      copyCurrentUser.birthday = birthday!;
      copyCurrentUser.nationality = nationality!;
      copyCurrentUser.profilePicture = profilePicture!;
      copyCurrentUser.gamesWon = gamesWon!;
      setCurrentUser(copyCurrentUser);
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
      currentUser ? setUsername(currentUser.username) : setUsername(null);
      currentUser ? setPassword(currentUser.password) : setPassword(null);
      currentUser ? setBirthday(currentUser.birthday) : setBirthday(null);
      currentUser
        ? setNationality(currentUser.nationality)
        : setNationality(null);
      currentUser
        ? setProfilePicture(currentUser.profilePicture)
        : setProfilePicture(null);
      setEditMode(false);
      currentUser ? setGamesWon(currentUser.gamesWon) : setGamesWon(null);
    }
  };

  const randomColor = () => {
    const colors = [
      "#FFCDD2",
      "#F8BBD0",
      "#E1BEE7",
      "#D1C4E9",
      "#C5CAE9",
      "#BBDEFB",
      "#B3E5FC",
      "#B2EBF2",
      "#B2DFDB",
      "#C8E6C9",
      "#DCEDC8",
      "#F0F4C3",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      localStorage.setItem("profilePicture", imageDataUrl);
      setProfilePicture(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfilePicture(null);
    localStorage.removeItem("profilePicture");
  };

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: localStorage.getItem("token")! },
        });

        setCurrentUser(response.data);
        setUsername(response.data.username);
        setPassword(response.data.password);
        response.data.birthday
          ? setBirthday(new Date(response.data.birthday))
          : setBirthday(null);
        response.data.nationality
          ? setNationality(response.data.nationality)
          : setNationality(null);
        response.data.profilePicture
          ? setProfilePicture(response.data.profilePicture)
          : setProfilePicture(null);
        setGamesWon(response.data.gamesWon);
      } catch (error: AxiosError | any) {
        if (error.response.status === 404) {
          alert(error.response.data.message);
          navigate("/game");
        } else {
          alert(error.response.data.message);
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          navigate("/register");
          console.error(error);
        }
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await api.get("/countries");
        setAllCountries(response.data.map((country: any) => country.name));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);
  useEffect(() => {
    console.log(allLobbies);
  }, [allLobbies]);
  function refreshPage() {
    window.location.reload();
  }
  useEffect(() => {
    async function fetchLobbies() {
      try {
        console.log("started fetching all games");
        const response = await api.get("/games");
        const lobbies = response;
        setAllLobbies(response.data);
        console.log("response:");
        console.log(response);
        console.log("allLobbies:");
        console.log(allLobbies);
        //console.log(allLobbies.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchLobbies();
  }, []);

  // Render profile edit form
  const renderEditForm = () => {
    if (!currentUser) return null;
    return <div></div>;
  };

  // Render profile view
  const renderProfileView = () => {
    if (!currentUser) return null;
    return (
      <div>
        <Typography variant="h1">Game Lobbies</Typography>
        <Typography variant="h5">
          You can either use a code provided by a friend to join a specific
          lobby or you can choose a lobby from our list{" "}
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
          <Chip label="Refresh!" onClick={refreshPage} />
        </TableContainer>
        <Button variant="outlined" onClick={() => navigate(`/game/`)}>
          Back to Main
        </Button>
      </div>
    );
  };

  // Main content rendering
  const content = currentUser ? (
    editMode ? (
      renderEditForm()
    ) : (
      renderProfileView()
    )
  ) : (
    <div></div>
  );

  return <Container>{content}</Container>;
};

export default GameLobbyOverview;
