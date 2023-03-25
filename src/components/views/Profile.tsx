import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Profile: React.FC = () => {
  const id = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [username, setUsername] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);

  const saveChanges = async () => {
    try {
      console.log("Updating User");
      let requestBody = {
        username: username,
        birthday: birthday,
        status: "ONLINE",
      };
      console.log(" The Request Body is: ", requestBody);
      const response = await api.put(`/users/${id}`, requestBody, {
        headers: { Authorization: localStorage.getItem("token")! },
      });

      setEditMode(false);
      const copyCurrentUser = { ...currentUser! };
      copyCurrentUser.username = username!;
      copyCurrentUser.birthday = birthday!;
      setCurrentUser(copyCurrentUser);
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
      currentUser ? setUsername(currentUser.username) : setUsername(null);
      currentUser ? setBirthday(currentUser.birthday) : setBirthday(null);
      setEditMode(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        //make an API get request with /users/:id
        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: localStorage.getItem("token")! },
        });

        setCurrentUser(response.data);
        setUsername(response.data.username);
        response.data.birthday
          ? setBirthday(new Date(response.data.birthday))
          : setBirthday(null);
      } catch (error: AxiosError | any) {
        //look for error code 404 and go back to main page
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

  let content = <div></div>;

  if (editMode && currentUser) {
    content = (
      <div>
        <Typography variant="h3">
          Username:
          <TextField
            value={username!}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
            sx={{ marginLeft: 2 }}
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

        {String(localStorage.getItem("id")) === String(currentUser.id) ? (
          <div>
            <Button
              variant="outlined"
              onClick={() => {
                setUsername(currentUser.username);
                setBirthday(new Date(currentUser.birthday!));
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
  }

  if (currentUser && !editMode) {
    content = (
      <div>
        <Typography variant="h3">
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
  }
  return <Container> {content}</Container>;
};

export default Profile;
