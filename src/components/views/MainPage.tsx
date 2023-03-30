import { useEffect, useState } from "react";
import { api } from "helpers/api";
import {
  Button,
  List,
  Typography,
  ListItem,
  Container,
  Box,
  Grid,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import User from "models/User";
import React from "react";
import axios, { AxiosError } from "axios";
import SockJS from "sockjs-client";
import WebsocketPacket from "models/WebsocketPacket";
import WebsocketType from "models/WebsocketType";
import { Client } from "@stomp/stompjs";
import { getDomain } from "helpers/getDomain";
import { useWebSocket } from "helpers/WebSocketContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Badge from "@mui/material/Badge";

interface Props {
  onTokenChange: (token: string | null) => void;
}

const MainPage: React.FC<Props> = ({ onTokenChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const socket = useWebSocket();
  const [users, setUsers] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const userId = localStorage.getItem("userId");

  const [websocketPacket, setWebsocketPacket] =
    useState<WebsocketPacket | null>(null);

  const websocketUrl = `${getDomain()}/topic/${token}`;

  useEffect(() => {
    if (token) {
      onTokenChange(token);
    } else {
      console.log("No token found in local storage");
    }
  }, []);

  function convertToWebsocketTypeEnum(
    typeString: string
  ): WebsocketType | undefined {
    switch (typeString) {
      case "GAMESTATEUPDATE":
        return WebsocketType.GAMESTATEUPDATE;
      case "CATEGORYUPDATE":
        return WebsocketType.CATEGORYUPDATE;
      case "TIMEUPDATE":
        return WebsocketType.TIMEUPDATE;
      case "PLAYERUPDATE":
        return WebsocketType.PLAYERUPDATE;
      default:
        console.error(`Invalid WebsocketType string received: ${typeString}`);
        return undefined;
    }
  }

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
      if (userId) {
        const response = await api.post("/games", { userId: userId });
        const gameId = response.data.gameId;

        navigate(`/game/lobby/${gameId}`);
      }
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
  const goToGameLobby = async (): Promise<void> => {
    navigate(`/game/gamelobby/`);
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
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      ></Menu>
      <Container>
        <Typography variant="h1">Dashboard</Typography>
        {usercontent}
        <Typography variant="h4">
          Click on users to see their details
        </Typography>
        {content}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Card elevation={0}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  onClick={() => createGame()}
                >
                  Create a new Game!
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  onClick={() => goToGameLobby()}
                >
                  Join a Lobby!
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card elevation={3}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  onClick={() => navigate("/game/countries")}
                >
                  Learn!
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
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
              Profile Settings
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MainPage;
