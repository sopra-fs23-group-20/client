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
import {Link, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import User from "models/User";
import React from "react";
import axios, { AxiosError } from "axios";
import SockJS from "sockjs-client";
import WebsocketPacket from "models/WebsocketPacket";
import WebsocketType from "models/constant/WebsocketType";
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


  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);



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
    navigate(`/game/lobbies/`);
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
      <Container>
        <Typography variant="h1">Dashboard</Typography>
        <Box
          sx={{
            pt: 3,
            pb: 3,
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Link to="/game/lobbyCreation" style={{ textDecoration: 'none' }}>
            <Card
                sx={{ height: '100%', width: '100%'}}
                elevation={isHovered1 ? 30 : 3}
                onMouseEnter={() => setIsHovered1(true)}
                onMouseLeave={() => setIsHovered1(false)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography gutterBottom variant="h5" component="div">
                    Create a new Game!
                  </Typography>
              </CardContent>
            </Card>
          </Link>
          <Link to="/game/lobby" style={{ textDecoration: 'none' }}>
            <Card
                sx={{ height: '100%', width: '100%'}}
                elevation={isHovered2 ? 30 : 3}
                onMouseEnter={() => setIsHovered2(true)}
                onMouseLeave={() => setIsHovered2(false)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography gutterBottom variant="h5" component="div">
                    Join a Lobby!
                  </Typography>
              </CardContent>
            </Card>
          </Link>
          <Link to="/game/countries" style={{ textDecoration: 'none' }}>
            <Card
                sx={{ height: '100%', width: '100%' }}
                elevation={isHovered3 ? 30 : 3}
                onMouseEnter={() => setIsHovered3(true)}
                onMouseLeave={() => setIsHovered3(false)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography gutterBottom variant="h5" component="div">
                  Learn!
                </Typography>
              </CardContent>
            </Card>
          </Link>

        </Box>
      </Container>
      <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
      >
        <MenuItem onClick={() => navigate("/game/")}>Dashboard</MenuItem>
        <MenuItem onClick={goToSettings}>My Account</MenuItem>
        <MenuItem onClick={() => navigate("/game/countries")}>All Countries</MenuItem>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default MainPage;
