import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { AxiosError } from "axios";
import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import SockJS from "sockjs-client";
import GameState from "models/constant/GameState";
import Country from "models/Country";
import { getDomain } from "helpers/getDomain";
import WebsocketType from "models/constant/WebsocketType";
import WebsocketPacket from "models/WebsocketPacket";
import MapContainer from "components/ui/MapContainer";
import Autocomplete from "@mui/material/Autocomplete";
import OutlineContainer from "components/ui/OutlineContainer";
import { TextField } from "@mui/material";
import React, { useMemo } from "react";
import Category from "models/Category";

interface Props {
  currentCaregory: Category | null | undefined;
  height: number;
  width: number;
}

const HintContainer: React.FC<Props> = (props) => {
  if (!props.currentCaregory) return <div></div>;

  const currentCaregory = props.currentCaregory;

  const formatNumber = (number: number): string => {
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return formattedNumber.replace(/,/g, "'");
  };
  return (
    <>
      {currentCaregory.population ? (
        <Typography variant="h3">
          Population:{" "}
          {formatNumber(currentCaregory.population.valueOf()).toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
      {currentCaregory.outline ? (
        <OutlineContainer
          country={currentCaregory.outline.toString()}
          height={props.height}
          width={props.width}
        />
      ) : (
        <div></div>
      )}
      {currentCaregory.location ? (
        // Pass the properties of currentCaregory to the new Country instance
        <MapContainer
          country={
            new Country(
              null,
              currentCaregory.population,
              currentCaregory.capital,
              currentCaregory.flag,
              currentCaregory.location,
              currentCaregory.outline
            )
          }
          width={props.width}
          height={props.height}
        />
      ) : (
        <div></div>
      )}

      {currentCaregory.flag ? (
        <div>
          <img
            src={currentCaregory.flag.toString()}
            style={{
              maxWidth: "100%",
              marginBottom: "10px",
            }}
          />
        </div>
      ) : (
        <div></div>
      )}

      {currentCaregory.capital ? (
        <Typography variant="h3">
          {" "}
          Capital: {currentCaregory.capital.toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
    </>
  );
};
export default HintContainer;
