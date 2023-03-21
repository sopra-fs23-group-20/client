import React, { useEffect, useRef } from "react";
import { geoPath, geoIdentity } from "d3-geo";
import geoJSONCountries from "./countries.json";

interface CountryOutlineProps {
  countryCode: string;
}

const CountryOutline2: React.FC<CountryOutlineProps> = ({ countryCode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const country = geoJSONCountries.features.find(
    (feature: any) => feature.properties.ISO_A3 === countryCode
  );

  useEffect(() => {
    if (!canvasRef.current || !country) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const projection = geoIdentity()
      .reflectY(true)
      .fitSize([canvas.width, canvas.height], country);

    const pathGenerator = geoPath().projection(projection).context(context);

    context.beginPath();
    pathGenerator(country);
    context.fillStyle = "#EAEAEC";
    context.fill();

    context.lineWidth = 1;
    context.strokeStyle = "#D6D6DA";
    context.stroke();
  }, [canvasRef, country]);

  if (!country) {
    return <div>Country not found</div>;
  }

  return <canvas ref={canvasRef} width={1000} height={1000}></canvas>;
};

export default CountryOutline2;
