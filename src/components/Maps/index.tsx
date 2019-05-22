import React, { useRef } from "react";

import ReactGoogleMapLoader from "react-google-maps-loader";

import { key } from "../../key";

import "./styles.scss";

declare var MarkerClusterer: any;

interface Row {
  [key: string]: string | number;
}

const blueMarker = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const yellowMarker = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
const greenMarker = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";

let map: google.maps.Map;
let markers: google.maps.Marker[] = [];
let markerClusterer: typeof MarkerClusterer;

const Maps: React.FC<{
  setRowDetails: (row: Row) => void;
  data: Row[];
  markersColors: {
    blue: boolean;
    yellow: boolean;
    green: boolean;
  };
}> = ({ setRowDetails, data, markersColors }) => {
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

          markers = data
            .map(row => {
              const position = new googleMaps.LatLng(
                Number(row.latitude),
                Number(row.longitude)
              );
              const marker = new googleMaps.Marker({ position, map });

              marker.addListener("dblclick", e => {
                setRowDetails(row);
              });

              const isPositive = () => {
                const cols = [
                  "RESUL_PRNT",
                  "RESUL_SORO",
                  "RESUL_NS1",
                  "RESUL_VI_N",
                  "RESUL_PCR_",
                  "HISTOPA_N",
                  "IMUNOH_N"
                ].map(value => {
                  return Number(row[value]) === 1;
                });
                const res = cols.reduce((acc, cur) => acc || cur, false);
                return res;
              };

              const isTPAUTOCTO = () => {
                return Number(row["TPAUTOCTO"]) === 1;
              };

              if (!isPositive()) {
                marker.setIcon(blueMarker);
                if (!markersColors.blue) {
                  marker.setMap(null);
                  marker.setVisible(false);
                }
              } else {
                if (isTPAUTOCTO()) {
                  marker.setIcon(yellowMarker);
                  if (!markersColors.yellow) {
                    marker.setMap(null);
                    marker.setVisible(false);
                  }
                } else {
                  marker.setIcon(greenMarker);
                  if (!markersColors.green) {
                    marker.setMap(null);
                    marker.setVisible(false);
                  }
                }
              }

              return marker;
            })
            .filter(marker => marker.getVisible());

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
