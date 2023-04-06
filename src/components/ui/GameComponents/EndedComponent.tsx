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

interface Props {}
const EndedComponent: React.FC<Props> = (props) => {
  return (
    <div>
      <Typography variant="h2">Game has Ended</Typography>
    </div>
  );
};
export default EndedComponent;
