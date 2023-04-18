import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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

const Rules: React.FC = () => {
  const typewriterText = useTypewriter("GuessTheCountry: Rules and Guidelines");
  const navigate = useNavigate();
  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#44b7e3",
    color: "white",
    borderRadius: 30,
    padding: "10px 30px",
    fontWeight: 700,
    letterSpacing: 2,
    fontSize: "1rem",
    textTransform: "uppercase",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#34D1BF",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      transform: "translateY(-2px)",
    },
  }));
  return (
    <motion.div
      className="rulesRoot"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "1rem",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="rulesContainer">
        <motion.div className="rulesText" variants={textVariants}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Roboto Slab', serif",
              fontSize: "3rem",
              fontWeight: 800,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
              marginBottom: "2rem",
            }}
          >
            {typewriterText}
          </Typography>
          <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
            Are you ready to expand your knowledge of countries from all over
            the world while engaging in friendly competition?
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Here's how to play:
          </Typography>
          <ol>
            <li>
              Players can either create a lobby or enter someone else's lobby.
            </li>
            <li>
              If a player creates a lobby, they can choose the number of rounds,
              rounds per seconds, hints to be displayed, and whether the lobby
              is open or closed.
            </li>
            <li>
              The lobby creator starts the game when all players have joined.
            </li>
            <li>
              At each round, a country name will be displayed on the screen.
            </li>
            <li>
              The first player to correctly guess the country will receive
              points. The faster the player guesses, the more points they will
              receive.
            </li>
            <li>
              If no one guesses correctly within a set amount of time, a hint
              will be displayed.
            </li>
            <li>
              After the set number of rounds specified by the lobby creator, the
              game ends, and the final leaderboard is displayed.
            </li>
            <li>
              The leaderboard shows each player's score and rank. The player
              with the highest score wins the game.
            </li>
          </ol>
          <p>To guarantee the most fun and engaging experience, you should:</p>
          <ul>
            <li>
              Have a minimum knowledge of countries from all over the world.
            </li>
            <li>Not use any external resources to gain an advantage.</li>
            <li>Not share answers with other players.</li>
          </ul>
          <p
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.2rem",
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            Have fun and good luck!
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          >
            <CustomButton onClick={() => navigate("/game")}>
              Back to Main Page
            </CustomButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Rules;
