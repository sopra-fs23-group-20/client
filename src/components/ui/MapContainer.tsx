import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import * as React from "react";
import Country from "models/Country";
import Category from "models/Category";

const MapContainer: React.FC<Country> = (category: Country) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  console.log("API KEY " + process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  const mapContainerStyle = {
    width: 500,
    height: 350,
  };

  const mapOptions = {
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#FF0000",
          },
          {
            weight: 2,
          },
        ],
      },
    ],
    streetViewControl: false,
    gestureHandling: "cooperative",
    mapTypeId: "hybrid",
    tilt: 0,
    mapTypeControlOptions: {
      mapTypeIds: ["hybrid", "roadmap"],
    },
  };

  let center = {
    lat: 0,
    lng: 0,
  };

  if (category.location) {
    center = {
      lat: category.location.latitude.valueOf(),
      lng: category.location.longitude.valueOf(),
    };
  }
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;
  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        options={mapOptions}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
