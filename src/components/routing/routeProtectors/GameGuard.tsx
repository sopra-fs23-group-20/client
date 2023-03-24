import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import React, { FC } from "react";

interface GameGuardProps {
  children: React.ReactNode;
}

export const GameGuard: FC<GameGuardProps> = ({ children }) => {
  if (localStorage.getItem("token")) {
    return <>{children}</>;
  }
  return <Navigate to="/login" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node,
};
