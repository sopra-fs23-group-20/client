import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Avatar,
  Input,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { AxiosError } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";

const Profile: React.FC = () => {
  const id = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [nationality, setNationality] = useState<string | null>(null);
  const [gamesWon, setGamesWon] = useState<number | null>(null);
  const [allCountries, setAllCountries] = useState<Array<string>>([]);

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

  // Render profile edit form
  const renderEditForm = () => {
    if (!currentUser) return null;
    return (
      <div>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              backgroundColor: profilePicture ? "transparent" : randomColor(),
            }}
            src={profilePicture || ""}
            alt={currentUser.username ?? ""}
          >
            {profilePicture
              ? ""
              : currentUser.username?.[0]?.toUpperCase() ?? ""}
          </Avatar>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="contained-button-file">
            <Button variant="outlined" component="span">
              Upload Profile Picture
            </Button>
          </label>
          {profilePicture && (
            <IconButton
              color="error"
              onClick={removeImage}
              sx={{
                marginLeft: 30,
                color: "red",
                marginRight: 2,
                marginBottom: 1,
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="h3">
          Username:
          <TextField
            value={username!}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
            sx={{ marginLeft: 2 }}
          />
        </Typography>
        <Typography variant="h3">
          Password:
          <TextField
            value={password!}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            sx={{ marginLeft: 2.8 }}
          />
        </Typography>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Status: {currentUser.status}{" "}
        </Typography>

        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Creation Date:{" "}
          {currentUser.creation_date
            ? new Date(currentUser.creation_date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "No Creation Date"}
        </Typography>

        <Typography variant="h4" sx={{ marginTop: 3 }}>
          Birthday:
          <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
            <DatePicker
              label="Select date"
              sx={{ marginLeft: 2 }}
              value={dayjs(birthday)}
              onAccept={(newValue) => {
                newValue ? setBirthday(newValue.toDate()) : setBirthday(null);
              }}
            />
          </LocalizationProvider>
        </Typography>
        <Typography variant="h4" sx={{ marginTop: 3 }}>
          Nationality:
          <Autocomplete
            sx={{ marginLeft: 2 }}
            value={nationality}
            onChange={(_, newValue) => setNationality(newValue)}
            options={allCountries}
            renderInput={(params) => <TextField {...params} />}
          />
        </Typography>

        {String(localStorage.getItem("id")) === String(currentUser.id) ? (
          <div>
            <Button
              variant="outlined"
              onClick={() => {
                setUsername(currentUser.username);
                setPassword(currentUser.password);
                setBirthday(new Date(currentUser.birthday!));
                setNationality(currentUser.nationality);
                setProfilePicture(currentUser.profilePicture);
                setEditMode(false);
              }}
            >
              Discard
            </Button>
            <Button
              variant="outlined"
              sx={{ margin: 2 }}
              disabled={!username}
              onClick={() => saveChanges()}
            >
              Save
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  // Render profile view
  const renderProfileView = () => {
    if (!currentUser) return null;
    return (
      <div>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              backgroundColor: profilePicture ? "transparent" : randomColor(),
            }}
            src={profilePicture || ""}
            alt={currentUser.username ?? ""}
          >
            {profilePicture
              ? ""
              : currentUser.username?.[0]?.toUpperCase() ?? ""}
          </Avatar>
        </Box>
        <Typography variant="h4">
          Username:{" "}
          <span style={{ color: "MediumAquaMarine" }}>
            {currentUser.username}
          </span>
        </Typography>
        <Typography sx={{ marginTop: 2 }} variant="h4">
          Status: {currentUser.status}
        </Typography>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Creation Date:{" "}
          {new Date(currentUser.creation_date!).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Typography>
        {currentUser.birthday ? (
          <Typography variant="h4" sx={{ marginTop: 2 }}>
            Birthday:{" "}
            {currentUser.birthday
              ? new Date(currentUser.birthday).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "No Birthday"}
          </Typography>
        ) : (
          <div></div>
        )}
        {currentUser.nationality && (
          <Typography variant="h4" sx={{ marginTop: 3 }}>
            Nationality: {currentUser.nationality}
          </Typography>
        )}
        <Typography variant="h4">
          Games Won:{" "}
          <span>{currentUser.gamesWon ? currentUser.gamesWon : 0}</span>
        </Typography>

        {String(localStorage.getItem("id")) === String(currentUser.id) ? (
          <Button
            variant="outlined"
            onClick={() => setEditMode(true)}
            sx={{ marginTop: 2 }}
          >
            Edit your Profile
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={() => navigate("/game")}
          sx={{ marginTop: 2, marginLeft: 2 }}
          variant="outlined"
        >
          Back to Users Overview
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

export default Profile;
