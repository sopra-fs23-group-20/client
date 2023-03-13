import { Redirect, Route } from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from "prop-types";
import React, { FC } from "react";
import Profile from "components/views/Profile";

interface GameRouterProps {
  base: string;
}

const GameRouter: FC<GameRouterProps> = ({ base }) => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Route exact path={`${base}/dashboard`}>
        <Game />
      </Route>
      <Route exact path={`${base}`}>
        <Redirect to={`${base}/dashboard`} />
      </Route>
      <Route exact path="/game/profile/:userID">
        <Profile />
      </Route>
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string.isRequired,
};

export default GameRouter;
