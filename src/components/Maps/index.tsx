import React, { useRef } from "react";

import ReactGoogleMapLoader from "react-google-maps-loader";

import { key } from "../../key";

import "./styles.scss";

declare var MarkerClusterer: any;

interface Row {
  [key: string]: string | number;
}

let map: google.maps.Map;
let markers: google.maps.Marker[] = [];
let markerClusterer: typeof MarkerClusterer;

const Maps: React.FC<{ setRowDetails: (row: Row) => void; data: Row[] }> = ({
  setRowDetails,
  data
}) => {
  const mapRef = useRef(null);

  return (
    <ReactGoogleMapLoader
      params={{ key, libraries: "places,geometry" }}
      render={googleMaps => {
        if (!!googleMaps) {
          if (!!!map) {
            map = new googleMaps.Map(mapRef.current, {
              center: { lat: -22.0087, lng: -47.8909 },
              zoom: 14
            });
          }

          markers.forEach(marker => marker.setMap(null));

          markers = data.map(row => {
            const position = new googleMaps.LatLng(
              Number(row.latitude),
              Number(row.longitude)
            );
            const marker = new googleMaps.Marker({ position, map });

            marker.addListener("dblclick", e => {
              setRowDetails(row);
            });

            return marker;
          });

          if (!!markerClusterer) {
            markerClusterer.clearMarkers();
          }

          markerClusterer = new MarkerClusterer(map, markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
          });
        }
        return <div className="Map" ref={mapRef} />;
      }}
    />
  );
};

export default React.memo(Maps);
