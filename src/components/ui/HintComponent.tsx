import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import SockJS from "sockjs-client";
import GameState from "models/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import MapContainer from "components/ui/MapContainer";
import Autocomplete from "@mui/material/Autocomplete";
import CountryOutline from "components/ui/CountryOutline";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";

interface Props {
  currentCountryHint: Country;
}

const HintComponent: React.FC<Props> = (props) => {
  const currentCountryHint = props.currentCountryHint;

  const formatNumber = (number: number): string => {
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return formattedNumber.replace(/,/g, "'");
  };
  return (
    <>
      {currentCountryHint.population ? (
        <Typography variant="h3">
          Population:{" "}
          {formatNumber(currentCountryHint.population.valueOf()).toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
      {currentCountryHint.outline ? (
        <CountryOutline country={currentCountryHint.outline.toString()} />
      ) : (
        <div></div>
      )}
      {currentCountryHint.location ? (
        <MapContainer {...currentCountryHint}> </MapContainer>
      ) : (
        <div></div>
      )}

      {currentCountryHint.flag ? (
        <div>
          <img
            src={currentCountryHint.flag.toString()}
            style={{
              maxWidth: "100%",
              marginBottom: "10px",
            }}
          />
        </div>
      ) : (
        <div></div>
      )}

      {currentCountryHint.capital ? (
        <Typography variant="h3">
          {" "}
          Capital: {currentCountryHint.capital.toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
    </>
  );
};
export default HintComponent;
