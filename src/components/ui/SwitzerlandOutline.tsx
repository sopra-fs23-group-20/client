// src/SwitzerlandOutline.tsx

import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import countriesGeoJSON from "./countries.json";
import type { LatLngBoundsExpression } from "leaflet";

const switzerlandCountryCode = "CHE";
const switzerlandGeoJSON = countriesGeoJSON.features.find(
  (feature: any) => feature.properties.ISO_A3 === switzerlandCountryCode
);
const SwitzerlandOutline: React.FC = () => {
  const switzerlandBounds = L.geoJSON(switzerlandGeoJSON).getBounds();
  console.log(switzerlandBounds);
  console.log(switzerlandGeoJSON);
  return (
    <MapContainer center={[46.8182, 8.2275]} zoom={7}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={switzerlandGeoJSON}
        style={{ color: "black", fillColor: "transparent", weight: 1 }}
      />
    </MapContainer>
  );
};

export default SwitzerlandOutline;
