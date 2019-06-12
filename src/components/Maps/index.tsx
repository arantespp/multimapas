import React, { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'react-accessible-accordion';
import ReactGoogleMapLoader from 'react-google-maps-loader';

import { key } from '../../key';

import { Data } from '../../interfaces/data';

import './styles.scss';

declare var MarkerClusterer: any;

type FilterNames = 'Positivo' | 'Autóctone' | 'Não Autóctone';

interface Filter {
  name: FilterNames;
  filter: (data: Data, index: number) => boolean;
}

interface Props {
  chosenFiltersDefault?: FilterNames[];
  showClusterDefault?: boolean;
  data: Data[];
  openDataDetailsModal: (data: Data) => void;
}

const isMarkerClustererScriptLoaded = (): boolean => {
  return !!(window as any).MarkerClusterer;
};

const blueMarker = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
const yellowMarker = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
const greenMarker = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';

const markerColor = (data: Data) => {
  if (!filterIsPositive.filter(data, 0)) {
    return blueMarker;
  } else {
    if (filterIsAutoctone.filter(data, 0)) {
      return yellowMarker;
    } else {
      return greenMarker;
    }
  }
};

const filterIsPositive: Filter = {
  name: 'Positivo',
  filter: (data, index) => {
    const cols = [
      'RESUL_PRNT',
      'RESUL_SORO',
      'RESUL_NS1',
      'RESUL_VI_N',
      'RESUL_PCR_',
      'HISTOPA_N',
      'IMUNOH_N'
    ].map(value => {
      return Number(data[value as keyof Data]) === 1;
    });
    const res = cols.reduce((acc, cur) => acc || cur, false);
    return res;
  }
};

const filterIsAutoctone: Filter = {
  name: 'Autóctone',
  filter: (data, index) => {
    return Number(data['TPAUTOCTO']) === 1;
  }
};

const filterIsNotAutoctone: Filter = {
  name: 'Não Autóctone',
  filter: (data, index) => {
    return Number(data['TPAUTOCTO']) !== 1;
  }
};

const filters: Filter[] = [
  filterIsPositive,
  filterIsAutoctone,
  filterIsNotAutoctone
];

const applyFilters = (filtersNameToBeApplied: FilterNames[]) => (
  data: Data,
  index: number
): boolean => {
  const filtersToBeApplied: Filter[] = filters.filter(({ name }) => {
    const existsFiltersNameToBeApplied = filtersNameToBeApplied.find(
      filtersNameToBeAppliedName => filtersNameToBeAppliedName === name
    );
    return !!existsFiltersNameToBeApplied;
  });

  return filtersToBeApplied.reduce<boolean>((acc, { filter }) => {
    return acc && filter(data, index);
  }, true);
};

const Maps: React.FC<Props> = ({
  chosenFiltersDefault = [],
  data,
  showClusterDefault = true,
  openDataDetailsModal
}) => {
  const mapRef = useRef(null);
  const [chosenFilters, setChosenFilters] = useState<FilterNames[]>(
    chosenFiltersDefault
  );
  const [map, setMap] = useState<google.maps.Map>();
  const [showCluster, setShowCluster] = useState<boolean>(showClusterDefault);

  let markers: google.maps.Marker[] = [];
  let markerClusterer: typeof MarkerClusterer;

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

  const filterOnChange = (filterName: FilterNames) => () => {
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
            {filters.map(({ name }) => {
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
                  mapTypeControl: false,
                  zoom: 14
                })
              );
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
              marker.addListener('dblclick', e => {
                openDataDetailsModal(d);
              });
              return marker;
            });

            if (!!map && showCluster && isMarkerClustererScriptLoaded()) {
              markerClusterer = new MarkerClusterer(map, markers, {
                imagePath:
                  'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
              });
            }
          }

          return <div className="map" ref={mapRef} />;
        }}
      />
    </div>
  );
};

export default Maps;
