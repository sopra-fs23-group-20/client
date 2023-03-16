import React from "react";
import Country from "models/Country";
import { LoadScript } from "@react-google-maps/api";
import MapContainer from "./MapContainer";

const CountryContainer: React.FC<Country> = (country: Country) => {
  if (!country.longitude || !country.latitude) {
    // Country does not have longitude and latitude
    return null;
  }

  return (
    <div>
      <h1>Name: {country.name}</h1>
      <h2>Population: {country.population}</h2>
      {country.flag ? (
        <div style={{ textAlign: "left" }}>
          <img
            src={country.flag}
            alt={`${country.name} flag`}
            style={{
              maxWidth: "100%",
              marginBottom: "10px",
            }}
          />
        </div>
      ) : null}
      <MapContainer {...country} />
      <br />
      <br />
      <br />
    </div>
  );
};
//AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q
export default CountryContainer;
