import { Typography } from "@mui/material";
import React from "react";

interface HeaderProps {
  height: number;
}

const Header: React.FC<HeaderProps> = ({ height }) => (
  <div className="header container" style={{ height: `${height}px` }}>
    <Typography variant="h1">GuessTheCountry</Typography>
  </div>
);

export default Header;
