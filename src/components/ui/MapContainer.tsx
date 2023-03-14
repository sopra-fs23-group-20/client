import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import * as React from "react";
import Country from "models/Country";

const MapContainer: React.FC<Country> = (country: Country) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCGpjoidns0V63_IcMTuOzMdeI8pPD7D9Q",
  });

  const mapContainerStyle = {
    width: "100%",
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
            color: "#000000",
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
      style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: window.google.maps.ControlPosition.TOP_CENTER,
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
