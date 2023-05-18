import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import * as React from "react";
import Country from "models/Country";
import { useState } from "react";

interface MapContainerProps {
  country: Country;
  width: number;
  height: number;
}

const MapContainer: React.FC<MapContainerProps> = ({
  country,
  width,
  height,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const [lastCenter, setLastCenter] = useState<google.maps.LatLng | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: width,
    height: height,
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

  if (country.location) {
    center = {
      lat: country.location.latitude.valueOf(),
      lng: country.location.longitude.valueOf(),
    };
  }
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (
      lastCenter &&
      e.latLng &&
      lastCenter.lat().toFixed(6) === e.latLng.lat().toFixed(6) &&
      lastCenter.lng().toFixed(6) === e.latLng.lng().toFixed(6)
    ) {
      e.stop();
    } else if (e.latLng) {
      setLastCenter(e.latLng);
    }
  };

  const handleLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const handleCenterChanged = () => {
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter)
        if (!newCenter.equals(lastCenter)) {
          setLastCenter(newCenter);
        }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        options={mapOptions}
        onClick={handleClick}
        onLoad={handleLoad}
        onCenterChanged={handleCenterChanged}
      >
        <Marker position={center} />
      </GoogleMap>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default MapContainer;
