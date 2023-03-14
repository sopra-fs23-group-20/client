import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import * as React from "react";
import Country from "models/Country";

const MapContainer: React.FC<Country> = (country: Country) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const mapContainerStyle = {
    width: "50%",
    height: "500px",
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

  if (country.latitude != null && country.longitude != null) {
    center = {
      lat: country.latitude,
      lng: country.longitude,
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
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
