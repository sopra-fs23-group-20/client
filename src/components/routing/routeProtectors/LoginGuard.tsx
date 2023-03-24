import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import React, { FC } from "react";

interface LoginGuardProps {
  children: React.ReactNode;
}

export const LoginGuard: FC<LoginGuardProps> = ({ children }) => {
  if (!localStorage.getItem("token")) {
    return <>{children}</>;
  }
  // if user is already logged in, redirects to the main /app
  return <Navigate to="/game" />;
};

LoginGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
