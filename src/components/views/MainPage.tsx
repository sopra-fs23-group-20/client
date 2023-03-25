import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import {
  Button,
  List,
  Typography,
  ListItem,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import User from "models/User";
import React from "react";
import { AxiosError } from "axios";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const makeOffline = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem("id");
      const response = await api.put(
        `/users/${userId}`,
        {
          username: currentUser?.username,
          birthday: currentUser?.birthday,
          status: "OFFLINE",
        },
        { headers: { Authorization: localStorage.getItem("token") ?? "" } }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      navigate("/login");
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      navigate("/login");
    }
  };

  const createGame = async (): Promise<void> => {
    try {
      const response = await api.post("/games", {
        username: currentUser?.username,
      });

      const gameId = response.data.gameId;

      // Redirect the user to the game page
      navigate(`/game/lobby/${gameId}`);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      navigate("/login");
    }
  };

  const logout = (): void => {
    makeOffline();
  };

  interface PlayerProps {
    user: User;
  }

  const Player = ({ user }: PlayerProps): JSX.Element => (
    <div className="player container">
      <div className="player username"></div>
    </div>
  );

  Player.propTypes = {
    user: PropTypes.object,
  };

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });

        setUsers(response.data);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUser(): Promise<void> {
      try {
        let id = localStorage.getItem("id");

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });

        setCurrentUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  const goToSettings = async (): Promise<void> => {
    navigate(`/game/profile/${currentUser?.id}`);
  };

  let content = <></>;

  if (users) {
    content = (
      <Box
        sx={{
          maxHeight: 500, // Adjust this value according to your desired maximum list height
          overflow: "auto",
        }}
      >
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <Button
                variant="contained"
                onClick={() => navigate(`/game/profile/${user.id}`)}
              >
                <Typography variant="h6"> {user.username}</Typography>
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  let usercontent = <p>You aren't logged in</p>;

  if (currentUser) {
    usercontent = (
      <Typography variant="h4">
        You are currently logged in as:{" "}
        <span style={{ color: "MediumAquaMarine", fontWeight: 800 }}>
          {currentUser.username}
        </span>
      </Typography>
    );
  }

  return (
    <Container>
      <Typography variant="h1">Users Overview</Typography>
      {usercontent}
      <Typography variant="h4">Click on users to see their details</Typography>
      {content}
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <Button
            variant="outlined"
            onClick={() => navigate("/game/countries")}
            sx={{ marginTop: 4 }}
          >
            Checkout all Countries
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            sx={{ marginTop: 4 }}
            variant="outlined"
            onClick={() => createGame()}
          >
            Start a new Game
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button variant="outlined" onClick={() => logout()}>
            Logout
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button variant="outlined" onClick={() => goToSettings()}>
            Settings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
