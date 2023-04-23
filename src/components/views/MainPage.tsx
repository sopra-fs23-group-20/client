import { useEffect, useState } from "react";
import { api } from "helpers/api";
import useTypewriter from "react-typewriter-hook";

import { Button, Typography, Container, Box, Card } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import User from "models/User";
import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from "axios";
import WebsocketPacket from "models/WebsocketPacket";
import WebsocketType from "models/constant/WebsocketType";
import { getDomain } from "helpers/getDomain";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";

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

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const typewriterText = useTypewriter("Welcome to GTC!");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [websocketPacket, setWebsocketPacket] =
    useState<WebsocketPacket | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const websocketUrl = `${getDomain()}/topic/${token}`;

  useEffect(() => {
    if (token) {
      onTokenChange(token);
    } else {
      console.log("No token found in local storage");
    }
  }, [onTokenChange, token]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      console.log(response.data);

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
  }, [navigate, userId]);

  return (
    <Container
      sx={{
        marginTop: "10vh",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
            minHeight: "56px",
          }}
        >
          {typewriterText}
        </Typography>
      </Box>
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
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant="outlined"
          >
            <Typography gutterBottom variant="h5" component="div">
              Menu
            </Typography>
          </Button>
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
              <MenuItem onClick={() => navigate("/game/leaderboard")}>Leaderboard</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>

          <Link to="/game/lobbyCreation" style={{ textDecoration: "none" }}>
            <Card
              sx={{ height: "100%", width: "100%" }}
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
                <Typography gutterBottom variant="h5" component="div">
                  Create Game!
                </Typography>
              </CardContent>
            </Card>
          </Link>
          <Link to="/game/lobbies" style={{ textDecoration: "none" }}>
            <Card
              sx={{ height: "100%", width: "100%" }}
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
                <Typography gutterBottom variant="h5" component="div">
                  Join Lobby!
                </Typography>
              </CardContent>
            </Card>
          </Link>
          <Link to="/game/rules" style={{ textDecoration: "none" }}>
            <Card
              sx={{ height: "100%", width: "100%" }}
              elevation={isHovered3 ? 30 : 3}
              onMouseEnter={() => setIsHovered3(true)}
              onMouseLeave={() => setIsHovered3(false)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography gutterBottom variant="h5" component="div">
                  Game Rules
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default MainPage;
