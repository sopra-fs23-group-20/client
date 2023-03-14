import React from "react";

function CountryMap(longitude: number, latitude: number) {
  const apiKey = "AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q";
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=5&size=400x400&key=${apiKey}&style=feature:administrative|visibility:off&style=feature:poi|visibility:off&style=feature:water|color:0x8DC6F7&style=feature:road|visibility:off&style=feature:administrative.country|visibility:on&style=element:labels|visibility:off&style=element:geometry.stroke|color:0x000000&markers=color:red%7C${latitude},${longitude}`;

  return (
    <div>
      <h1>Map of Country</h1>
      <img src={mapUrl} alt="Map of Country" />
    </div>
  );
}

export default CountryMap;
