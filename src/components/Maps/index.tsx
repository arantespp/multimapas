import React, { useRef } from "react";

import ReactGoogleMapLoader from "react-google-maps-loader";

import "./styles.scss";

const Maps: React.FC = () => {
  const mapRef = useRef(null);
  const Map = () => <div className="Map" ref={mapRef} />;
  let map: google.maps.Map;

  return (
    <ReactGoogleMapLoader
      params={{
        key: "AIzaSyDimOyjTMfbc4oqMMXb4Shc9ODRaMR6h9U", // Define your api key here
        libraries: "places,geometry" // To request multiple libraries, separate them with a comma
      }}
      render={googleMaps => {
        if (!!googleMaps) {
          if (!!!map) {
            map = new googleMaps.Map(mapRef.current, {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8
            });
          }
        }
        return <Map />;
      }}
    />
  );
};

export default Maps;
