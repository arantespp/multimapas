import React, { useState } from "react";

import ReactGoogleMapLoader from "react-google-maps-loader";

import { key } from "../../key";

import Loading from "../Loading";

import "./styles.scss";

interface Row {
  [key: string]: string | number;
}

const MAX_TRIES = 3;
let geocoderTimeout = 500;
const GEOCODER_INCREASE = 250;

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
  const [geocoderStarted, setGeocoderStarted] = useState(false);

  console.log("function", geocoderStarted);

  return (
    <ReactGoogleMapLoader
      params={{ key, libraries: "places,geometry" }}
      render={googleMaps => {
        if (!!!googleMaps) {
          return <Loading />;
        }

        console.log("return ReactGoogleMapLoader", geocoderStarted);

        const geocoder = new googleMaps.Geocoder();

        const getLatLng = (
          address: string
        ): Promise<google.maps.GeocoderResult> => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log("geocoder", new Date().getSeconds(), address);
              geocoder.geocode({ address }, (result, status) => {
                if (status === googleMaps.GeocoderStatus.OK) {
                  resolve(result[0]);
                } else {
                  console.error(status);
                  reject(status);
                }
              });
            }, geocoderTimeout);
          });
        };

        const stopGeocoder = () => {
          console.log(geocoderStarted);
          // setGeocoderStarted(false);
        };

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
          console.log("getAllLatLng1", geocoderStarted);
          if (!!!next) {
            return;
          }

          console.log("getAllLatLng2", geocoderStarted);

          try {
            const address = getAddress(next.row);
            const { geometry } = await getLatLng(address);
            console.log("try", geocoderStarted);
            next.row.latitude = geometry.location.lat();
            next.row.longitude = geometry.location.lng();
            // Remove data
            allLatLngToBeDiscovered = allLatLngToBeDiscovered.filter(
              ({ row }) => row.id !== next.row.id
            );
            setData(JSON.stringify(data));
          } catch (err) {
            console.error("getAllLatLng err", err);
            geocoderTimeout += GEOCODER_INCREASE;
            next.tries += 1;
          }

          console.log("final da getAllLatLng", geocoderStarted);
          // if (geocoderStarted) {
          await getAllLatLng();
          // }
        };

        const startGeocoder = () => {
          console.log("startGeocoder1", geocoderStarted);
          setGeocoderStarted(true);
          console.log("startGeocoder2", geocoderStarted);

          getAllLatLng()
            .then(() => {
              console.log("AAAAAAAAAA", geocoderStarted);
              // setGeocoderStarted(false);
            })
            .catch(err => console.error("err2", err));
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
                {!geocoderStarted ? (
                  <button
                    className="button is-success"
                    disabled={data.filter(row => !hasLatLng(row)).length === 0}
                    onClick={startGeocoder}
                  >
                    Obter lat/lng
                  </button>
                ) : (
                  <button className="button is-success" onClick={stopGeocoder}>
                    Parar
                  </button>
                )}
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

export default React.memo(GetLatLng);
