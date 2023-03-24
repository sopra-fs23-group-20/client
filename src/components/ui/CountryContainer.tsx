import React from "react";
import Country from "models/Country";
import { LoadScript } from "@react-google-maps/api";
import MapContainer from "./MapContainer";
import CountryOutline from "./CountryOutline";

const CountryContainer: React.FC<Country> = (country: Country) => {
  if (!country.location) {
    // Country does not have longitude and latitude
    return null;
  }

  return (
    <>
      <h1>Name: {country.name}</h1>
      <h2>Population: {country.population?.toString()}</h2>
      <h2>Capital: {country.capital}</h2>
      {country.flag ? (
        <div style={{ textAlign: "left" }}>
          <img
            src={country.flag.toString()}
            alt={`${country.name} flag`}
            style={{
              maxWidth: "100%",
              marginBottom: "10px",
            }}
          />
        </div>
      ) : null}
      <div>
        {country.outline ? (
          <CountryOutline country={country.outline.toString()}></CountryOutline>
        ) : (
          <div />
        )}
      </div>
      <MapContainer {...country} />
      <br />
      <br />
      <br />
    </>
  );
};
//AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q
export default CountryContainer;
