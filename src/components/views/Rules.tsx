import React, { useEffect, useState } from "react";
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
import LobbyBrowser from "./images/LobbyBrowser.png";
import GameSettings from "./images/GameSettings.png";
import InTheGame from "./images/InTheGame.png";
import GameLobby from "./images/GameLobby.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Paper, Grid } from "@mui/material";

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
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1079);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1079);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChangemobile =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const typewriterText = useTypewriter("Rules and Guidelines");
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div id={"full page"}>
      {isDesktop ? (
        <div id={"desktop version"}>
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
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                marginBottom: "40px",
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
                      size="large"
                      sx={{ mb: 4 }}
                      variant="outlined"
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
                    Are you ready to expand your knowledge of countries from all
                    over the world while engaging in friendly competition?
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
                          Players can either create a lobby or enter someone
                          else's lobby.
                        </li>
                        <li>
                          If a player creates a lobby, he/she can choose the
                          number of rounds, rounds per seconds, hints to be
                          displayed, whether the lobby is open or closed, the
                          time between rounds, how many guesses are allowed, and
                          which game mode to play (Normal or Blitz). In the
                          Blitz mode, in addition to the provided hints, 6
                          buttons with different country names are provided, of
                          which one is the correct country.
                        </li>
                        <li>
                          The lobby creator starts the game when all players
                          have joined.
                        </li>
                        <li>
                          At each round, a country name will be displayed on the
                          screen.
                        </li>
                        <li>
                          The first player to correctly guess the country will
                          receive points. The faster the player guesses, the
                          more points they will receive.
                        </li>
                        <li>
                          If no one guesses correctly within a set amount of
                          time, a hint will be displayed.
                        </li>
                        <li>
                          After the set number of rounds specified by the lobby
                          creator, the game ends, and the final leaderboard is
                          displayed.
                        </li>
                        <li>
                          The leaderboard shows each player's score and rank.
                          The player with the highest score wins the game.
                        </li>
                      </ol>
                      <p>
                        To guarantee the most fun and engaging experience, you
                        should:
                      </p>
                      <ul>
                        <li>
                          Have a minimum knowledge of countries from all over
                          the world.
                        </li>
                        <li>
                          Not use any external resources to gain an advantage.
                        </li>
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
                          <Paper sx={{ mb: 2 }}>
                            <TabList
                              onChange={handleChange}
                              aria-label="lab API tabs example"
                              variant="fullWidth"
                              indicatorColor="primary"
                              textColor="primary"
                            >
                              <Tab label="What's GTC?" value="1" />
                              <Tab label="Create a Game" value="2" />
                              <Tab label="Join a Game" value="3" />
                              <Tab label="The Lobby" value="4" />
                              <Tab label="The Game" value="5" />
                            </TabList>
                          </Paper>
                          <TabPanel value="1">
                            <Grid container>
                              <Typography sx={{ textAlign: "justify" }}>
                                Our project aims to create an interactive
                                platform that makes learning geography fun,
                                engaging, and accessible. By challenging users
                                to identify countries based on various clues, we
                                hope to enhance their geographic knowledge
                                across multiple domains. With this goal in mind,
                                we designed the project to be user-friendly,
                                visually appealing, and easy to navigate. Have
                                fun and good luck!
                              </Typography>
                            </Grid>
                          </TabPanel>
                          <TabPanel value="2">
                            <Grid container alignItems="center">
                              <Grid item xs={8}>
                                <Typography
                                  sx={{ mr: 4, textAlign: "justify" }}
                                >
                                  On our "Create a Game" page, you have the
                                  flexibility to customize your gaming
                                  experience by setting various parameters,
                                  ensuring a unique and engaging challenge each
                                  time you play. You can determine the number of
                                  rounds, round length, and the time between
                                  rounds, tailoring the game to your preferred
                                  pace. Additionally, you can choose between
                                  different difficulty levels and game modes to
                                  suit your skill level and interests. To make
                                  the game even more captivating, you have the
                                  option to select specific regions and decide
                                  the type of hints you'd like to receive during
                                  gameplay. Finally, you can control the
                                  visibility of your lobby, opting for a public
                                  or private setting. With these diverse
                                  customization options, our "Create a Game"
                                  page empowers you to design an exciting and
                                  personalized gaming experience.
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <img
                                  src={GameSettings}
                                  alt="GameSettings"
                                  style={{ width: "100%", objectFit: "cover" }}
                                />
                              </Grid>
                            </Grid>
                          </TabPanel>
                          <TabPanel value="3">
                            <Grid container alignItems="center">
                              <Grid item xs={6}>
                                <Box>
                                  <Typography
                                    sx={{ mr: 4, textAlign: "justify" }}
                                  >
                                    On our Join Lobby page, you have a multitude
                                    of options to find and join a game that
                                    suits your preferences. Browse through the
                                    server list of available games, where you
                                    can view the number of players currently in
                                    the lobby, the creator of the game, and its
                                    current state. To join a game, simply click
                                    on the green join button next to the desired
                                    lobby. Additionally, if you have a specific
                                    lobby in mind, you can directly join it by
                                    entering the lobby ID in the provided field
                                    at the top of the page. This seamless
                                    experience ensures that you can quickly find
                                    and participate in games tailored to your
                                    interests.
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <img
                                  src={LobbyBrowser}
                                  alt="Join Game"
                                  style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    objectFit: "cover",
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </TabPanel>
                          <TabPanel value="4">
                            <Grid container alignItems="center">
                              <Grid item xs={8}>
                                <Box>
                                  <Typography
                                    sx={{ mr: 4, textAlign: "justify" }}
                                  >
                                    On our Game Lobby page, you enter a central
                                    hub for the game you've just joined. This
                                    interactive and informative space is divided
                                    into several sections to keep you informed
                                    and engaged. First, you'll find a dedicated
                                    area that makes it easy for friends to join
                                    your game, either through a QR code or by
                                    sharing the direct lobby ID link. Second,
                                    you can keep track of all the players who
                                    have joined the lobby, providing an
                                    at-a-glance view of your competition.
                                    Lastly, you can review the game settings
                                    chosen by the host, ensuring you're familiar
                                    with the rules and format before the game
                                    starts. If you happen to be the host, you'll
                                    have the additional option to start the game
                                    at your discretion, located conveniently at
                                    the bottom of the page. The Game Lobby page
                                    is designed to bring all essential pre-game
                                    information together, creating a seamless
                                    experience for both hosts and players alike.{" "}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <img
                                  src={GameLobby}
                                  alt="Game Lobby"
                                  style={{ width: "100%", objectFit: "cover" }}
                                />
                              </Grid>
                            </Grid>
                          </TabPanel>
                          <TabPanel value="5">
                            <Grid container alignItems="center">
                              <Grid item xs={7}>
                                <Box>
                                  <Typography
                                    sx={{ mr: 4, textAlign: "justify" }}
                                  >
                                    On our Game Page, the action truly begins as
                                    the countdown starts ticking away at the top
                                    of the screen, accompanied by a visual
                                    representation of the remaining time. Your
                                    mission is to identify the country based on
                                    the hints displayed at the center of the
                                    page. If the Blitz game mode is selected for
                                    the current game, 6 different buttons with
                                    country names are given, and the goal is to
                                    click the one with the correct country name.
                                    To submit your guess, simply type the name
                                    of the country into the input field at the
                                    top of the screen. We understand that
                                    spelling can be challenging, especially for
                                    countries with unique or complex names. To
                                    assist you in your quest, the input field
                                    features an autocomplete function and
                                    provides suggestions to help you spell the
                                    country correctly. With a combination of
                                    quick thinking and accurate typing, you'll
                                    be on your way to becoming a master of
                                    geographical knowledge. You can use the
                                    "Quickjoin" button in order to get directly
                                    into a lobby, if a lobby is available.{" "}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={5}>
                                <img
                                  src={InTheGame}
                                  alt="The Game"
                                  style={{ width: "100%", objectFit: "cover" }}
                                />
                              </Grid>
                            </Grid>
                          </TabPanel>
                        </TabContext>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
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
        </div>
      ) : (
        <div id={"mobile version"}>
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
            }}
          >
            Rules and Guidelines
          </Typography>
          <Box textAlign="center">
            <Button
              sx={{ mb: 4 }}
              variant="outlined"
              size="large"
              color="error"
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => navigate("/game/")}
            >
              Back to Dashboard
            </Button>
          </Box>
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
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChangemobile("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Rules
              </Typography>
              <Typography sx={{ color: "text.secondary" }}></Typography>
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
                  rounds, rounds per seconds, hints to be displayed, whether the
                  lobby is open or closed, and which game mode to play (Normal
                  or Blitz). In the Blitz mode, in addition to the provided
                  hints, 6 buttons with different country names are provided, of
                  which one is the correct country.
                </li>
                <li>
                  The lobby creator starts the game when all players have
                  joined.
                </li>
                <li>
                  At each round, a country name will be displayed on the screen.
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
                  After the set number of rounds specified by the lobby creator,
                  the game ends, and the final leaderboard is displayed.
                </li>
                <li>
                  The leaderboard shows each player's score and rank. The player
                  with the highest score wins the game.
                </li>
              </ol>
              <p>
                To guarantee the most fun and engaging experience, you should:
              </p>
              <ul>
                <li>
                  Have a minimum knowledge of countries from all over the world.
                </li>
                <li>Not use any external resources to gain an advantage.</li>
                <li>Not share answers with other players.</li>
              </ul>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChangemobile("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header1"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Guide
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                What's GTC
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Our project aims to create an interactive platform that makes
                learning geography fun, engaging, and accessible. By challenging
                users to identify countries based on various clues, we hope to
                enhance their geographic knowledge across multiple domains. With
                this goal in mind, we designed the project to be user-friendly,
                visually appealing, and easy to navigate. Have fun and good
                luck!
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChangemobile("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content1"
              id="panel2bh-header2"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Guide
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Create a Game
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                On our "Create a Game" page, you have the flexibility to
                customize your gaming experience by setting various parameters,
                ensuring a unique and engaging challenge each time you play. You
                can determine the number of rounds, round length, and the time
                between rounds, tailoring the game to your preferred pace.
                Additionally, you can choose between different difficulty levels
                and game modes to suit your skill level and interests. To make
                the game even more captivating, you have the option to select
                specific regions and decide the type of hints you'd like to
                receive during gameplay. Finally, you can control the visibility
                of your lobby, opting for a public or private setting. With
                these diverse customization options, our "Create a Game" page
                empowers you to design an exciting and personalized gaming
                experience.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChangemobile("panel4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content2"
              id="panel2bh-header3"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Guide
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Join a Game
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                On our Join Lobby page, you have a multitude of options to find
                and join a game that suits your preferences. Browse through the
                server list of available games, where you can view the number of
                players currently in the lobby, the creator of the game, and its
                current state. To join a game, simply click on the green join
                button next to the desired lobby. Additionally, if you have a
                specific lobby in mind, you can directly join it by entering the
                lobby ID in the provided field at the top of the page. This
                seamless experience ensures that you can quickly find and
                participate in games tailored to your interests.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChangemobile("panel5")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content3"
              id="panel2bh-header4"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Guide
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                The Lobby
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                On our Game Lobby page, you enter a central hub for the game
                you've just joined. This interactive and informative space is
                divided into several sections to keep you informed and engaged.
                First, you'll find a dedicated area that makes it easy for
                friends to join your game, either through a QR code or by
                sharing the direct lobby ID link. Second, you can keep track of
                all the players who have joined the lobby, providing an
                at-a-glance view of your competition. Lastly, you can review the
                game settings chosen by the host, ensuring you're familiar with
                the rules and format before the game starts. If you happen to be
                the host, you'll have the additional option to start the game at
                your discretion, located conveniently at the bottom of the page.
                The Game Lobby page is designed to bring all essential pre-game
                information together, creating a seamless experience for both
                hosts and players alike.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel6"}
            onChange={handleChangemobile("panel6")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content4"
              id="panel3bh-header5"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Guide
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>The Game</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                On our Game Page, the action truly begins as the countdown
                starts ticking away at the top of the screen, accompanied by a
                visual representation of the remaining time. Your mission is to
                identify the country based on the hints displayed at the center
                of the page. If the Blitz game mode is selected for the current
                game, 6 different buttons with country names are given, and the
                goal is to click the one with the correct country name. To
                submit your guess, simply type the name of the country into the
                input field at the top of the screen. We understand that
                spelling can be challenging, especially for countries with
                unique or complex names. To assist you in your quest, the input
                field features an autocomplete function and provides suggestions
                to help you spell the country correctly. With a combination of
                quick thinking and accurate typing, you'll be on your way to
                becoming a master of geographical knowledge.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
}
