import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoJSONCountries from "./countries.json";

interface CountryOutlineProps {
  countryCode: string;
}

const CountryOutline: React.FC<CountryOutlineProps> = ({ countryCode }) => {
  const country = geoJSONCountries.features.find(
    (feature: any) => feature.properties.ISO_A3 === countryCode
  );

  if (!country) {
    return <div>Country not found</div>;
  }

  return (
    <div>
      <ComposableMap
        width={400}
        height={200}
        projectionConfig={{
          scale: 100,
        }}
      >
        <Geographies geography={[country]}>
          {({ geographies }) => (
            <Geography
              key={geographies[0].properties.ISO_A3}
              geography={geographies[0]}
              fill="#EAEAEC"
              stroke="#D6D6DA"
              strokeWidth={0.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default CountryOutline;
