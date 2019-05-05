import React, { useState } from "react";

import ReactGoogleMapLoader from "react-google-maps-loader";

import { key } from "../../key";

import Loading from "../Loading";

import "./styles.scss";

interface Row {
  [key: string]: string | number;
}

const MAX_TRIES = 3;
const GEOCODER_TIMEOUT = 100;

const hasLatLng = (row: Row): boolean => !!row.latitude && !!row.longitude;

const getAddress = ({ NM_LOGRADO, NU_NUMERO }: Row): string =>
  `${NM_LOGRADO} ${NU_NUMERO} São Carlos - SP`;

const GetLatLng: React.FC<{
  isActive?: boolean;
  data: Row[];
  headers: string[];
  setData: (data: string) => void;
  downloadData: () => void;
  close: () => void;
}> = ({ data, isActive, headers, setData, downloadData, close }) => {
  const [geocoderStated, setGeocoderStarted] = useState(false);

  return (
    <ReactGoogleMapLoader
      params={{ key, libraries: "places,geometry" }}
      render={googleMaps => {
        if (!!!googleMaps) {
          return <Loading />;
        }

        const geocoder = new googleMaps.Geocoder();

        const getLatLng = (
          address: string
        ): Promise<google.maps.GeocoderResult> => {
          return new Promise((resolve, reject) => {
            console.log("aqui no getLatLng ");
            setTimeout(() => {
              geocoder.geocode({ address }, (result, status) => {
                if (status === googleMaps.GeocoderStatus.OK) {
                  resolve(result[0]);
                } else {
                  console.error(status);
                  reject(status);
                }
              });
            }, GEOCODER_TIMEOUT);
          });
        };

        const startGeocoder = () => {
          setGeocoderStarted(true);

          interface LatLngToBeDiscovered {
            row: Row;
            tries: number;
          }

          let allLatLngToBeDiscovered: LatLngToBeDiscovered[] = data
            .filter(row => !hasLatLng(row))
            .map(row => ({ tries: 0, row }));

          const nextLatLngToBeDiscovered = ():
            | LatLngToBeDiscovered
            | undefined => {
            for (const latLngToBeDiscovered of allLatLngToBeDiscovered) {
              if (latLngToBeDiscovered.tries < MAX_TRIES) {
                return latLngToBeDiscovered;
              }
            }
          };

          const getAllLatLng = async () => {
            const next = nextLatLngToBeDiscovered();
            if (!!!next) {
              return;
            }

            try {
              const address = getAddress(next.row);
              const { geometry } = await getLatLng(address);
              next.row.latitude = geometry.location.lat();
              next.row.longitude = geometry.location.lng();
              // Remove data
              allLatLngToBeDiscovered = allLatLngToBeDiscovered.filter(
                ({ row }) => row.id !== next.row.id
              );
              setData(JSON.stringify(data));
            } catch (err) {
              console.error("getAllLatLng err", err);
              next.tries += 1;
            }

            getAllLatLng();
          };

          getAllLatLng()
            .then(() => {
              console.log(data);
              setGeocoderStarted(false);
            })
            .catch(console.error);
        };

        return (
          <div className={`modal ${isActive && "is-active"}`}>
            <div className="modal-background" onClick={close} />
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">
                  Obter latitude e longitude de {data.length} dados
                </p>
                <button className="delete" aria-label="close" onClick={close} />
              </header>
              <section className="modal-card-body">
                <p className="title is-6">
                  Dados com latitude e longitude:{" "}
                  {data.filter(row => hasLatLng(row)).length}
                </p>

                <hr />
                <p className="title is-6">
                  Dados sem latitude e longitude:{" "}
                  {data.filter(row => !hasLatLng(row)).length}
                </p>
              </section>
              <footer
                className="modal-card-foot"
                style={{ justifyContent: "space-between" }}
              >
                <button
                  className={`button is-success ${
                    geocoderStated ? "is-loading" : ""
                  }`}
                  disabled={data.filter(row => !hasLatLng(row)).length === 0}
                  onClick={startGeocoder}
                >
                  Obter lat/lng
                </button>
                <button className="button" onClick={downloadData}>
                  Baixar novo arquivo
                </button>
              </footer>
            </div>
            <button className="modal-close is-large" aria-label="close" />
          </div>
        );
      }}
    />
  );
};

export default GetLatLng;
