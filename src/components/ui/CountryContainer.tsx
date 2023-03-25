import React from "react";
import Country from "models/Country";
import MapContainer from "./MapContainer";
import CountryOutline from "./CountryOutline";
import { Avatar, Container, Typography, Grid } from "@mui/material";

const CountryContainer: React.FC<Country> = (country: Country) => {
  if (!country.location) {
    // Country does not have longitude and latitude
    return null;
  }

  return (
    <Container>
      <Typography sx={{ marginTop: 4 }} variant="h2">
        Name: {country.name}{" "}
      </Typography>
      <Typography sx={{ marginTop: 1 }} variant="h3">
        Population: {country.population?.toString()}
      </Typography>
      <Typography sx={{ marginTop: 1 }} variant="h3">
        Capital: {country.capital}
      </Typography>
      {country.flag ? (
        <div style={{ textAlign: "left" }}>
          <Avatar
            variant="square"
            sx={{ width: 500, height: 350, marginTop: 1 }}
            src={country.flag.toString()}
            alt={`${country.name} flag`}
          />
        </div>
      ) : null}
      <Typography variant="h3">
        {country.outline ? (
          <CountryOutline country={country.outline.toString()}></CountryOutline>
        ) : (
          <div />
        )}
      </Typography>
      <MapContainer {...country} />
    </Container>
  );
};
//AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q
export default CountryContainer;
