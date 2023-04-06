import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import User from "models/User";
import { AxiosError } from "axios";
import Country from "models/Country";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import HintComponent from "../HintComponent";
import { useNavigate } from "react-router-dom";

interface Props {}
const EndedComponent: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="h2">Game has Ended</Typography>
      <Button variant="contained" onClick={(e) => navigate("/game")}>
        {" "}
        Back to Mainpage{" "}
      </Button>
    </div>
  );
};
export default EndedComponent;
