import React, {useEffect, useState} from "react";
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


export default function Landing() {

    return (
        <div id={"full page"}>
           <Typography>
               Here comes the new landing page
           </Typography>
        </div>
    );
}
