import { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "models/User";

import Country from "models/Country";

import MapContainer from "components/ui/MapContainer";

import OutlineContainer from "components/ui/OutlineContainer";

import React, { useMemo } from "react";
import Category from "models/Category";

interface Props {
  currentCaregory: Category | null | undefined;
}

const HintContainer: React.FC<Props> = (props) => {
  const hintRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const currentCaregory = props.currentCaregory;

  useEffect(() => {
    const hintWidth = hintRef.current?.getBoundingClientRect().width;
    if (hintWidth) {
      setWidth(hintWidth);
    }
  }, [hintRef]);

  const formatNumber = (number: number): string => {
    const formattedNumber = new Intl.NumberFormat("en-US").format(number);
    return formattedNumber.replace(/,/g, "'");
  };

  if (!currentCaregory) {
    return <div></div>;
  }

  return (
    <div ref={hintRef}>
      {currentCaregory.population ? (
        <Typography sx={{ margin: "2rem" }} align="center" variant="h2">
          Population:{" "}
          {formatNumber(currentCaregory.population.valueOf()).toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
      {currentCaregory.outline ? (
        <div>
          <Typography align="center" sx={{ margin: "2rem" }} variant="h2">
            Outline:
          </Typography>
          <OutlineContainer
            country={currentCaregory.outline.toString()}
            height={width * 0.6}
            width={width}
          />
        </div>
      ) : (
        <div></div>
      )}
      {currentCaregory.location ? (
        <div>
          <Typography align="center" sx={{ margin: "2rem" }} variant="h2">
            Location:
          </Typography>
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
            width={width}
            height={width * 0.6}
          />
        </div>
      ) : (
        <div></div>
      )}

      {currentCaregory.flag ? (
        <div>
          <Typography align="center" sx={{ margin: "2rem" }} variant="h2">
            Flag:
          </Typography>
          <img
            src={currentCaregory.flag.toString()}
            style={{
              width: "100%",
            }}
          />
        </div>
      ) : (
        <div></div>
      )}

      {currentCaregory.capital ? (
        <Typography sx={{ margin: "2rem" }} align="center" variant="h2">
          Capital: {currentCaregory.capital.toString()}{" "}
        </Typography>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default HintContainer;
