import { useEffect, useState } from "react";
import { api } from "helpers/api";
import useTypewriter from "react-typewriter-hook";

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
import { Link, useNavigate } from "react-router-dom";
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
import { styled, keyframes } from "@mui/system";
import { Alert } from "@mui/lab";
import { alpha, darken, lighten } from "@mui/material/styles";

interface Props {
  onTokenChange: (token: string | null) => void;
}

const useTypewriterr = (text: string, speed = 100, pause = 1000) => {
  const [typewriterText, setTypewriterText] = useState("");

  useEffect(() => {
    let index = 0;
    let isDeleting = false;

    const typeWriter = () => {
      if (!isDeleting && index < text.length) {
        setTypewriterText((prev) => prev + text.charAt(index));
        index++;
        setTimeout(typeWriter, speed);
      } else if (!isDeleting && index === text.length) {
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, pause);
      } else if (isDeleting && index > 0) {
        setTypewriterText((prev) => prev.substring(0, prev.length - 1));
        index--;
        setTimeout(typeWriter, speed);
      } else if (isDeleting && index === 0) {
        isDeleting = false;
        setTimeout(typeWriter, pause);
      }
    };

    typeWriter();
  }, [text, speed, pause]);

  return typewriterText;
};

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

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const typewriterText = useTypewriterr("Select game mode", 100, 1000);

  const cardAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;
  const AnimatedCard = styled(Card)`
    &:hover {
      transform: scale(1.05);
      background-color: ${(props) =>
        props.theme.palette.mode === "dark"
          ? darken(props.theme.palette.background.paper, 0.1)
          : lighten(props.theme.palette.background.paper, 0.1)};
    }
  `;
  const AnimatedButton = styled(Button)`
    transition: all 0.3s ease;
    &:hover {
      background-color: ${(props) =>
        alpha(
          props.theme.palette.primary.main,
          props.theme.palette.action.hoverOpacity
        )};
    }
  `;
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

  useEffect(() => {
    async function fetchCurrentUser(): Promise<void> {
      try {
        const response = await api.get(`/users/${userId}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });

        setCurrentUser(response.data);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/register");
        console.error(error);
      }
    }
    fetchCurrentUser();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          mt: 2,
          ml: 2,
        }}
      >
        <AnimatedButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            fontFamily: "'Roboto Slab', serif",
          }}
        >
          Menu
        </AnimatedButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => navigate(`/game/profile/${userId}`)}>
            My Account
          </MenuItem>
          <MenuItem onClick={() => navigate("/game/countries")}>
            All Countries
          </MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </Box>
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Roboto Slab', serif",
          fontSize: "3rem",
          fontWeight: 800,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        {typewriterText}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            pt: 3,
            pb: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Link to="/game/lobbyCreation" style={{ textDecoration: "none" }}>
            <AnimatedCard
              sx={{ height: "125%", width: "125%" }}
              elevation={isHovered1 ? 30 : 3}
              onMouseEnter={() => setIsHovered1(true)}
              onMouseLeave={() => setIsHovered1(false)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "'Roboto Slab', serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Create New Game
                </Typography>
              </CardContent>
            </AnimatedCard>
          </Link>
          <Link to="/game/lobbies" style={{ textDecoration: "none" }}>
            <AnimatedCard
              sx={{ height: "125%", width: "125%" }}
              elevation={isHovered2 ? 30 : 3}
              onMouseEnter={() => setIsHovered2(true)}
              onMouseLeave={() => setIsHovered2(false)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "'Roboto Slab', serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Join Lobby
                </Typography>
              </CardContent>
            </AnimatedCard>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default MainPage;
