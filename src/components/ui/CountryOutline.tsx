import React from "react";
import { geoPath, geoIdentity, geoBounds } from "d3-geo";

interface CountryOutlineProps {
  country: string;
  width?: number;
  height?: number;
}

const CountryOutline: React.FC<CountryOutlineProps> = ({ country, width = 500, height = 350 }) => {
  const countryJSON = JSON.parse(country);
  //const country = geoJSONCountries.features.find(
  //  (feature: any) => feature.properties.ISO_A3 === countryCode
  //);

  console.log(countryJSON);
  if (!countryJSON) {
    return <div>Country not found</div>;
  }


  const padding = 10;

  const bounds = geoBounds(countryJSON);
  const topLeft = bounds[0];
  const bottomRight = bounds[1];

  const scale = Math.min(
    (width - padding * 2) / (bottomRight[0] - topLeft[0]),
    (height - padding * 2) / (bottomRight[1] - topLeft[1])
  );

  const translateX = (width - (bottomRight[0] + topLeft[0]) * scale) / 2;
  const translateY = (height + (bottomRight[1] + topLeft[1]) * scale) / 2;

  const projection = geoIdentity()
    .scale(scale)
    .reflectY(true)
    .translate([translateX, translateY]);

  const pathGenerator = geoPath().projection(projection);
  const pathData = pathGenerator(countryJSON);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ backgroundColor: "#000000" }}
    >
      <path
        d={pathData || ""}
        fill="#EAEAEC"
        stroke="#D6D6DA"
        strokeWidth={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CountryOutline;
