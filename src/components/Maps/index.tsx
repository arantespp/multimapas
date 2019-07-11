import React, { useEffect, useRef, useState, SyntheticEvent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'react-accessible-accordion';
import ReactGoogleMapLoader from 'react-google-maps-loader';

import { applyFilters, filters } from './filters';
import { polygonsData } from './polygons-data';

import { key } from '../../key';

import { Data } from '../../interfaces/data';

import './styles.scss';
import SearchDateForm from '../SearchDateForm';


declare var MarkerClusterer: any;

interface Props {
  chosenFiltersDefault?: string[];
  showClusterDefault?: boolean;
  data: Data[];
  openDataDetailsModal: (data: Data) => void;
  height: number;
  width: number;
}

const isMarkerClustererScriptLoaded = (): boolean => {
  return !!(window as any).MarkerClusterer;
};

const blueMarker = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
const yellowMarker = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
const greenMarker = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';

const markerColor = (data: Data) => {
  if (!filters.isPositive.filter(data, 0)) {
    return blueMarker;
  } else {
    if (filters.isAutoctone.filter(data, 0)) {
      return yellowMarker;
    } else {
      return greenMarker;
    }
  }
};

const Maps: React.FC<Props> = ({
  chosenFiltersDefault = [],
  data,
  showClusterDefault = true,
  openDataDetailsModal,
  height,
  width
}) => {
  const mapRef = useRef(null);
  const [chosenFilters, setChosenFilters] = useState<string[]>(
    chosenFiltersDefault
  );
  const [map, setMap] = useState<google.maps.Map>();
  const [showCluster, setShowCluster] = useState<boolean>(showClusterDefault);

  let markers: google.maps.Marker[] = [];
  let markerClusterer: typeof MarkerClusterer;
  let polygons: Array<{ polygon: google.maps.Polygon; id: string }>;

  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
      if (!!markerClusterer) {
        markerClusterer.clearMarkers();
      }
    };
  });

  const showClusterOnChange = () => {
    setShowCluster(!showCluster);
  };

  const filterOnChange = (filterName: string) => () => {
    setChosenFilters(cf => {
      const filterExists = !!cf.find(filter => filter === filterName);
      return filterExists
        ? cf.filter(name => name !== filterName)
        : [...cf, filterName];
    });
  };

  const filterMenuIsChecked = (filter: string): boolean => {
    return !!chosenFilters.find(filterName => filter === filterName);
  };

  const Menu = () => {
    return (
      <Accordion
        className="Accordion"
        allowZeroExpanded={true}
        preExpanded={['0']}
      >
        <AccordionItem uuid="0">
          <AccordionItemHeading>
            <AccordionItemButton className="AccordionItemButton">
              <FontAwesomeIcon icon="angle-down" />
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            {isMarkerClustererScriptLoaded() ? (
              <div>
                <input
                  onChange={showClusterOnChange}
                  type="checkbox"
                  checked={showCluster}
                />
                <span>Mostrar Clusters</span>
              </div>
            ) : null}
            {Object.values(filters).map(({ name }) => {
              return (
                <div key={name}>
                  <input
                    onChange={filterOnChange(name)}
                    type="checkbox"
                    name={name}
                    value={name}
                    checked={filterMenuIsChecked(name)}
                  />
                  <span>{name}</span>
                </div>
              );
            })}
            {
              <SearchDateForm data = {data}/>
            }
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <div className="Maps">
      <div className="menu">
        <Menu />
      </div>
      <ReactGoogleMapLoader
        params={{ key, libraries: 'places,geometry' }}
        render={googleMaps => {
          if (!!googleMaps) {
            if (!!!map) {
              setMap(
                new googleMaps.Map(mapRef.current, {
                  center: { lat: -22.0087, lng: -47.8909 },
                  disableDoubleClickZoom: true,
                  mapTypeControl: false,
                  zoom: 14
                })
              );
            }

            // if (!kmlLayer) {
            //   kmlLayer = new googleMaps.KmlLayer({
            //     map,
            //     preserveViewport: true,
            //     // screenOverlays: false,
            //     // suppressInfoWindows?: boolean;
            //     url: `https://arantespp.github.io/multimapas/KMZs/sao-carlos.kmz`
            //   });
            // }

            const infoWindow = new googleMaps.InfoWindow();

            if (!polygons) {
              polygons = polygonsData.map(({ id, paths }) => {
                const polygon = new googleMaps.Polygon({
                  map,
                  paths,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.5,
                  strokeWeight: 1,
                  fillColor: '#FF0000',
                  fillOpacity: 0.05,
                  clickable: true
                });
                polygon.addListener('click', e => {
                  const latLng = e.latLng;
                  infoWindow.setContent(id);
                  infoWindow.setPosition(latLng);
                  infoWindow.open(map);
                });
                return { id, polygon };
              });
            }

            markers = data.filter(applyFilters(chosenFilters)).map(d => {
              const position = new googleMaps.LatLng(
                Number(d.latitude),
                Number(d.longitude)
              );
              const marker = new googleMaps.Marker({
                position,
                map,
                icon: markerColor(d)
              });
              marker.addListener('click', e => {
                let block = '???';
                if (polygons) {
                  polygons.forEach(({ id, polygon }) => {
                    if (
                      googleMaps.geometry.poly.containsLocation(
                        e.latLng,
                        polygon
                      )
                    ) {
                      block = id;
                    }
                  });
                }
                openDataDetailsModal({ ...d, block });
              });
              return marker;
            });

            if (!!map && showCluster && isMarkerClustererScriptLoaded()) {
              markerClusterer = new MarkerClusterer(map, markers, {
                imagePath: './markerclusterer/m'
              });
            }
          }

          return <div className="map" style={{ width, height }} ref={mapRef} />;
        }}
      />
    </div>
  );
};

export default Maps;
