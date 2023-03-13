import React from "react";
import "styles/views/Header.scss";

interface HeaderProps {
  height: number;
}

const Header: React.FC<HeaderProps> = ({ height }) => (
  <div className="header container" style={{ height: `${height}px` }}>
    <h1 className="header title">SoPra FS23 rocks with React!</h1>
  </div>
);

export default Header;