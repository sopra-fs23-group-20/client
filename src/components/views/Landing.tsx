import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
import {
  DialogActions,
  Container,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LobbyBrowser from "./images/LobbyBrowser.png";
import GameSettings from "./images/GameSettings.png";
import InTheGame from "./images/InTheGame.png";
import GameLobby from "./images/GameLobby.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Paper, Grid } from "@mui/material";
import landingTheme from "../../styles/landingTheme";
import styled from "styled-components";
import backgroundimage from "./images/pattern-landingpage.png";
import Logo from "./images/GTC-Logo.png";
import Mockup from "./images/mockups.png";

const StyledDiv = styled.div``;
const ButtonCircle = styled.button``;

const divstyle = {
  top: 0,
  right: -300,
  //position:'absolute',
  borderRadius: "50%",
  width: "100vh",
  height: "100vh",
  background: "#5EB23F",
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={landingTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background: landingTheme.palette.background.default,
        }}
      >
        <StyledDiv>
          <div></div>
          <head>
            <title>Guess the Country - Welcome!</title>
          </head>
          <header>
            <style></style>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "100px", position: "absolute", top: 5, left: 5 }}
            />
          </header>
          <Typography variant="h2" id="Title" maxWidth="600px" padding="3em">
            Learning & Fun
          </Typography>
          <Typography
            variant="h5"
            id="maintext"
            style={{}}
            maxWidth="600px"
            top="50%"
            padding="1em"
          >
            <Box sx={{ fontWeight: "500" }}>
              "Guess The Country" is the new webapp: Learn more about Countries
              by competing in fun quiz rounds. You can also learn more about
              countries by using the all new learning cards. You can challenge
              your friends by playing against them and you can see your progress
              by looking at the leaderboard of all players. Join Now!
            </Box>
          </Typography>
          <Button
            size="large"
            sx={{
              marginLeft: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              left: "200px",
            }}
            variant="contained"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
          <Typography
            variant="h5"
            id="maintext"
            style={{}}
            maxWidth="600px"
            top="50%"
            padding="1em"
          >
            <Box sx={{ fontWeight: "500" }}>
              If you already have an account:
            </Box>
          </Typography>
          <Button
            size="large"
            sx={{
              marginLeft: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              left: "200px",
            }}
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <div
            id="green-circle"
            style={{
              borderRadius: "50%",
              width: "90vh",
              height: "90vh",
              background: "#5EB23F",
              position: "absolute",
              top: 0,
              right: -300,
            }}
          ></div>
          <div id="mockup">
            <img
              src={Mockup}
              alt="Mockup of the website"
              style={{
                width: "20%",
                objectFit: "cover",
                position: "absolute",
                top: "30%",
                right: 20,
              }}
            />
          </div>

          <Typography position="absolute" bottom="0" align="right">
            <a href="https://github.com/sopra-fs23-group-20/">by Group 20</a>
          </Typography>
        </StyledDiv>
      </Box>
    </ThemeProvider>
  );
}
