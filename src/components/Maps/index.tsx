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

import { applyFilters, filters } from './filters';
import { polygonsData } from './polygons-data';

import { key } from '../../key';

import { Data } from '../../interfaces/data';

import './styles.scss';

import moment from 'moment';
import 'moment/locale/pt-br';

import { months, epidemiologicalWeeksForTest } from '../../utils';



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
  
  //Estados dos inputs de datas.
  const [initialDateInput, setInitialDateInput]  = useState();
  const [finalDateInput, setFinalDateInput]  = useState();

  //Estados dos selects dos meses.
  const [initialMonth, setIinitialMonth] = useState();
  const [finalMonth, setFinalMonth] = useState();

  //Estados das selects das semanas epidemiologicas
  const [initialEpiWeek, setInitialEpiWeek]  = useState();
  const [finalEpiWeek, setFinalEpiWeek]  = useState();
  const [epidemiologicalWeeksFinal, setEpidemiologicalWeeksFinal] = useState(epidemiologicalWeeksForTest);

  useEffect(() => {
    setIinitialMonth(undefined);
    setFinalMonth(undefined);
    setInitialEpiWeek(undefined);
    setFinalEpiWeek(undefined);
    
  }, [initialDateInput]);

  useEffect(() => {
    setInitialDateInput(undefined);
    setFinalDateInput(undefined);
    setInitialEpiWeek(undefined);
    setFinalEpiWeek(undefined);

  }, [initialMonth]);

  useEffect(() => {
    setInitialDateInput(undefined);
    setFinalDateInput(undefined);
    setIinitialMonth(undefined);
    setFinalMonth(undefined);
    
    const newEpiWeeksFinal = epidemiologicalWeeksForTest.filter(week => week.numero > initialEpiWeek);
    setEpidemiologicalWeeksFinal(newEpiWeeksFinal);
    
  }, [initialEpiWeek]);

  /* Metodo utilizado para realizar a logica do filtro envolvendo datas. */
  const datesFiltered = (): Array<Data> => {
    if (initialDateInput) {
      if(finalDateInput) {
        const initialDate = moment(initialDateInput), finalDate = moment(finalDateInput);

        if (initialDate.isAfter(finalDate)) {
          return data.filter(data => data.dtNotific && data.dtNotific.isBetween(finalDate, initialDate.add(1,'day'), undefined, "[]"));
        } 
        
        return data.filter(data => data.dtNotific && data.dtNotific.isBetween(initialDate, finalDate.add(1,'day'), undefined, "[]"));
      } 
      
      return data.filter(data => data.dtNotific && data.dtNotific.isSameOrAfter(moment(initialDateInput)));
    }

    if (initialMonth) {
      if(finalMonth) {
        return data.filter(data => data.dtNotific && (data.dtNotific.month() == initialMonth || data.dtNotific.month() == finalMonth));
      }
      
      return data.filter(data => data.dtNotific && data.dtNotific.month() == initialMonth);
    }

    if (initialEpiWeek) {
      
      const epiWeekInitialYear = initialEpiWeek == 1 ? '2017' : '2018';
      const epiWeekFinalYear = '2018';

      const dateInfoInitialEpiWeek = epidemiologicalWeeksForTest.find((week) => {
        return week.numero == initialEpiWeek
      });

      const initialDate = `${epiWeekInitialYear}-${dateInfoInitialEpiWeek && dateInfoInitialEpiWeek.inicio.mes}-${dateInfoInitialEpiWeek && dateInfoInitialEpiWeek.inicio.dia}`;
      let finalDate = `${epiWeekFinalYear}-${dateInfoInitialEpiWeek && dateInfoInitialEpiWeek.final.mes}-${dateInfoInitialEpiWeek && dateInfoInitialEpiWeek.final.dia}`;
      
      if (finalEpiWeek) {
        const dateInfoFinalEpiWeek = epidemiologicalWeeksForTest.find((week) => {
          return week.numero == finalEpiWeek
        });
        
        finalDate = `${epiWeekFinalYear}-${dateInfoFinalEpiWeek && dateInfoFinalEpiWeek.final.mes}-${dateInfoFinalEpiWeek && dateInfoFinalEpiWeek.final.dia}`;
      }
            
      const dataEpiWeekFiltered = data.filter(data => data.dtNotific && data.dtNotific.isBetween(initialDate, finalDate, undefined, "[]"));

      return dataEpiWeekFiltered;
    }
    
    return data;
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
              <div className="search-inputs">
                <label>
                  Inicial:
                  <input 
                    type="date" 
                    onChange = {e => setInitialDateInput(e.target.value)}
                    value = {initialDateInput}/>
                </label>
                <label>
                  Final:
                  <input 
                    type="date"
                    onChange = {e => setFinalDateInput(e.target.value)}
                    value = {finalDateInput}/>
                </label>
              </div>
            }
            {
              <div className="search-inputs">
                <label>
                  Inicial:
                  <select value={initialMonth} onChange={e => setIinitialMonth(e.target.value)}>
                    <option>Escolha o mês</option>
                    {
                      months.map(month => {return (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      )})
                    }
                  </select>
                </label>
                <label>
                  Final:
                  <select value={finalMonth} onChange={e => setFinalMonth(e.target.value)}>
                    <option>Escolha o mês</option>
                    {
                      months.map(month => {return (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      )})
                    }
                  </select>
                </label>
              </div>
            }
            {
              <div className="search-inputs">
                <label>
                  Inicial:
                  <select value={initialEpiWeek} 
                    onChange = {e => setInitialEpiWeek(e.target.value)}>
                    <option>Semana Inicial</option> 
                    {
                      epidemiologicalWeeksForTest.map((semana) => {
                        return <option 
                            key = {`semana-inicial-${semana.numero}`} 
                            value ={semana.numero}>
                              {semana.numero}
                          </option>
                      })
                    }
                  </select>
                </label>
                <label>
                  Final:
                  <select value={finalEpiWeek} 
                    onChange = {e => setFinalEpiWeek(e.target.value)}>
                    <option>Semana Final</option> 
                    {
                      epidemiologicalWeeksFinal.map((semana) => {
                        return <option 
                            key={`semana-final-${semana.numero}`} 
                            value={semana.numero}>
                              {semana.numero}
                          </option>
                      })
                    }
                  </select>
                </label>
              </div>
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
            
            markers = datesFiltered()
              .filter(applyFilters(chosenFilters))
              .map(d => {
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
