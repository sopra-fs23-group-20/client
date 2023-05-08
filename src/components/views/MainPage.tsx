import { useEffect, useState } from "react";
import { api } from "helpers/api";
import useTypewriter from "react-typewriter-hook";

import {
  Button,
  Typography,
  Container,
  Box,
  Card,
  Divider,
  Tabs,
  Tab,
  Popover,
} from "@mui/material";
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
// @ts-ignore
import earth from "./gif/Earth2.1.gif";

import { useAlert } from "helpers/AlertContext";

interface Props {
  onTokenChange: (token: string | null) => void;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MainPage: React.FC<Props> = ({ onTokenChange }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [anchorElPopover, setAnchorElPopover] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorElPopover(null);
  };

  const openPopover = Boolean(anchorElPopover);
  const id = openPopover ? "simple-popover" : undefined;
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

  const typewriterText = useTypewriter("Guess The Country!");
  const { showAlert } = useAlert();

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
        showAlert(error.response.data.message, "error");
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
        marginTop: "calc(32vh - 64px)", // Adjust the margin top here
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={earth}
            alt="earth-gif"
            style={{ width: "50px", marginBottom: "5px", marginRight: "5px" }}
          />
          <Typography
            variant="h1"
            sx={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
              minHeight: "56px",
              mb: 1,
            }}
          >
            {typewriterText}
          </Typography>
          <img
            src={earth}
            alt="earth-gif"
            style={{ width: "50px", marginBottom: "5px", marginLeft: "5px" }}
          />
        </div>
      </Box>
      <Button
        aria-describedby={id}
        variant="contained"
        color="success"
        onClick={handleClickPopover}
      >
        Quick Tutorial
      </Button>
      <Popover
        sx={{ mt: 2 }}
        id={id}
        open={openPopover}
        anchorEl={anchorElPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "500px", p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Quick Tutorial
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{ mb: 2 }}
          >
            <Tab label="How it works?" {...a11yProps(0)} />
            <Tab label="Create a new game" {...a11yProps(1)} />
            <Tab label="Join a lobby" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Typography variant="body1">
              If the game starts, your goal is to correctly guess the searched
              country based on the given hints. If the Capital "Paris" is
              displayed, you should enter "France". The faster you submit the
              answer, the more points you will get.
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography variant="body1">
              You can create a new game lobby by clicking on the Create Game
              button. You can define, which hints should appear. If your game is
              public, other people can join or you can make the lobby private
              and invite your friends.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/game/lobbyCreation")}
              >
                Create Game
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography variant="body1">
              You can join open lobbies by accessing them in the lobby browser.
              You can only join private lobbies by using the link or by entering
              the GameID and click on the "Join game!" button.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/game/lobbies")}
              >
                View Lobbies
              </Button>
            </Box>
          </TabPanel>
          <Divider sx={{ mt: 2 }} />
          <Typography align="center" sx={{ p: 2 }}>
            Need more help?
            <Button
              variant="outlined"
              color="success"
              onClick={() => navigate("/game/rules")}
              sx={{ ml: 2 }}
            >
              View Guide
            </Button>
          </Typography>
        </Box>
      </Popover>

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
            sx={{mt:0.5}}
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
            <MenuItem onClick={() => navigate("/game/leaderboard")}>
              Leaderboard
            </MenuItem>
            <MenuItem onClick={() => navigate("/game/countries")}>
              Learn Countries
            </MenuItem>
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
