import React from "react";
import Country from "models/Country";
import { LoadScript } from "@react-google-maps/api";
import MapContainer from "./MapContainer";

const CountryElement: React.FC<Country> = (country: Country) => {
  if (!country.longitude || !country.latitude) {
    // Country does not have longitude and latitude
    return null;
  }

  return (
    <div>
      <h1>Name: {country.name}</h1>
      <h2>Population: {country.population}</h2>
      {country.flag ? (
        <img src={country.flag} alt={`${country.name} flag`} />
      ) : null}
      <MapContainer {...country} />
      <br />
      <br />
      <br />
    </div>
  );
};
//AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q
export default CountryElement;