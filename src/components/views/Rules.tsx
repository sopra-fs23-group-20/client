import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
import { DialogActions, Container, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Logo from "./images/GTCText.png";
import GameLobby from "./images/GameLobby.png";
import GameSettings from "./images/GameSettings.png";
import InTheGame from "./images/InTheGame.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: "-100vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.8 },
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    x: "-100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.5, duration: 0.8, type: "spring", stiffness: 120 },
  },
};

export default function Rules() {
  const typewriterText = useTypewriter("Rules and Guidelines");
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container
      sx={{
        marginTop: "10vh",
      }}
    >
      <motion.div
        className="rulesRoot"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div className="rulesContainer">
          <motion.div className="rulesText" variants={textVariants}>
            <Typography
              variant="h1"
              sx={{
                minHeight: "56px",
                textAlign: "center",
              }}
            >
              {typewriterText}
            </Typography>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ mb: 4 }}
                variant="outlined"
                size="small"
                color="error"
                startIcon={<KeyboardArrowLeftIcon />}
                onClick={() => navigate("/game/")}
              >
                Back to Dashboard
              </Button>
            </DialogActions>
            <Typography
              sx={{
                mb: 6,
                textAlign: "center",
              }}
              variant="h5"
            >
              Are you ready to expand your knowledge of countries from all over
              the world while engaging in friendly competition?
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>The Rules</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  Here's how to play:
                </Typography>
                <ol>
                  <li>
                    Players can either create a lobby or enter someone else's
                    lobby.
                  </li>
                  <li>
                    If a player creates a lobby, they can choose the number of
                    rounds, rounds per seconds, hints to be displayed, and
                    whether the lobby is open or closed.
                  </li>
                  <li>
                    The lobby creator starts the game when all players have
                    joined.
                  </li>
                  <li>
                    At each round, a country name will be displayed on the
                    screen.
                  </li>
                  <li>
                    The first player to correctly guess the country will receive
                    points. The faster the player guesses, the more points they
                    will receive.
                  </li>
                  <li>
                    If no one guesses correctly within a set amount of time, a
                    hint will be displayed.
                  </li>
                  <li>
                    After the set number of rounds specified by the lobby
                    creator, the game ends, and the final leaderboard is
                    displayed.
                  </li>
                  <li>
                    The leaderboard shows each player's score and rank. The
                    player with the highest score wins the game.
                  </li>
                </ol>
                <p>
                  To guarantee the most fun and engaging experience, you should:
                </p>
                <ul>
                  <li>
                    Have a minimum knowledge of countries from all over the
                    world.
                  </li>
                  <li>Not use any external resources to gain an advantage.</li>
                  <li>Not share answers with other players.</li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Guide</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Whats GTC?" value="1" />
                        <Tab label="Create a Game" value="2" />
                        <Tab label="Join a Game" value="3" />
                        <Tab label="The lobby" value="4" />
                        <Tab label="The Game" value="5" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      'Guess the Coutry' is an online game, where people can
                      play together by testing their knowledge about our
                      countries.
                    </TabPanel>
                    <TabPanel value="2">
                      <Typography>
                        When creating a new game, you can decide, what regions
                        should be included and the types of hints you want to
                        receive.
                      </Typography>
                      <img
                        src={GameSettings}
                        alt="GameSettings"
                        style={{ marginBottom: "2rem" }}
                      />
                    </TabPanel>
                    <TabPanel value="3">
                      You can join a game by selecting one from the lobby
                      browser and press the join button. If you received a Game
                      Code, you insert it and join the game.
                    </TabPanel>
                    <TabPanel value="4">
                      When you joined a game you can share it the lobby, view
                      the the joined players and the selected settings.
                      <img
                        src={GameLobby}
                        alt="Game Lobby"
                        style={{ marginBottom: "2rem" }}
                      />
                    </TabPanel>
                    <TabPanel value="5">
                      When the game starts, you have guess what country we are
                      looking for by analyzing the given hints. If you are
                      correct and fast, you will get the most points.
                      <img
                        src={InTheGame}
                        alt="The Game"
                        style={{ marginBottom: "2rem" }}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Typography
              sx={{
                mt: 4,
                textAlign: "center",
              }}
              variant="h5"
            >
              Have fun and good luck!
            </Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
              }}
            ></div>
          </motion.div>
        </div>
      </motion.div>
    </Container>
  );
}
