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

import { polygonsData } from './polygons-data';

import { key } from '../../key';

import { Data } from '../../interfaces/data';

import './styles.scss';

import moment from 'moment';
import 'moment/locale/pt-br';

import { months, epidemiologicalWeeksForTest, useStyles } from '../../utils';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Radio, RadioGroup, FormLabel } from '@material-ui/core';

declare var MarkerClusterer: any;

enum NotificationsFilter {
  Positives = 'Positives',
  Suspects = 'Suspects',
  All = 'All'
}

enum Analysis {
  All = 'All',
  Clinical = 'Clinical',
  Exam = 'Exam'
}
enum FinalClassification {
  All = 'All',
  Simple = 'Simple',
  Alarming = 'Alarming',
  Severe = 'Severe'
}

enum CaseEvolution {
  All = 'All',
  DeathFromDengue = 'DeathFromDengue',
  DeathFromOthers = 'DeathFromOthers',
  Cure = 'Cure',
  Ignored = 'Ignored'
}

interface Props {
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

const Maps: React.FC<Props> = ({
  data,
  showClusterDefault = true,
  openDataDetailsModal,
  height,
  width
}) => {
  const mapRef = useRef(null);

  const [map, setMap] = useState<google.maps.Map>();
  const [showCluster, setShowCluster] = useState<boolean>(showClusterDefault);

  let markers: google.maps.Marker[] = [];
  let markerClusterer: typeof MarkerClusterer;
  const polygons = useRef<Array<{ polygon: google.maps.Polygon; id: string }>>(
    []
  );

  const [notificationsFilter, setNotificationsFilter] = useState<
    NotificationsFilter
  >(NotificationsFilter.Positives);

  const [analysisFilter, setAnalysisFilter] = useState<Analysis>(Analysis.All);

  const [finalClassificationFilter, setFinalClassificationFilter] = useState<
    FinalClassification
  >(FinalClassification.All);

  const [caseEvolutionFilter, setCaseEvolutionFilter] = useState<CaseEvolution>(
    CaseEvolution.All
  );

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

  const [autoctonesCase, setAutoctonesCase] = useState(true);

  const autoctonesCaseOnChange = () => {
    setAutoctonesCase(!autoctonesCase);
  };

  //Estados dos inputs de datas.
  const [initialDateInput, setInitialDateInput] = useState();
  const [finalDateInput, setFinalDateInput] = useState();

  //Estados dos selects dos meses.
  const [initialMonth, setInitialMonth] = useState();
  const [finalMonth, setFinalMonth] = useState();
  const [finalMonths, setFinalMonths] = useState(months);

  //Estados das selects das semanas epidemiologicas
  const [initialEpiWeek, setInitialEpiWeek] = useState();
  const [finalEpiWeek, setFinalEpiWeek] = useState();
  const [epidemiologicalWeeksFinal, setEpidemiologicalWeeksFinal] = useState(
    epidemiologicalWeeksForTest
  );

  useEffect(() => {
    setInitialMonth(undefined);
    setFinalMonth(months);
    setInitialEpiWeek(undefined);
    setFinalEpiWeek(undefined);
  }, [initialDateInput]);

  useEffect(() => {
    setInitialDateInput(undefined);
    setFinalDateInput(undefined);
    setInitialEpiWeek(undefined);
    setFinalEpiWeek(undefined);

    const newFinalMonthsList = months.filter(
      month => month.value > initialMonth
    );
    setFinalMonths(newFinalMonthsList);
  }, [initialMonth]);

  useEffect(() => {
    setInitialDateInput(undefined);
    setFinalDateInput(undefined);
    setInitialMonth(undefined);
    setFinalMonth(months);

    const newEpiWeeksFinal = epidemiologicalWeeksForTest.filter(
      week => week.numero > initialEpiWeek
    );
    setEpidemiologicalWeeksFinal(newEpiWeeksFinal);
  }, [initialEpiWeek]);

  const markerColor = (data: Data) => {
    // if (!filters.isPositive.filter(data, 0)) {
    //   return blueMarker;
    // } else {
    //   if (filters.isAutoctone.filter(data, 0)) {
    //     return yellowMarker;
    //   } else {
    //     return greenMarker;
    //   }
    // }
    return yellowMarker;
  };

  /* Metodo utilizado para realizar a logica do filtro envolvendo datas. */
  //TODO: verificar o date range para a data (igual as datas dos sites de passagens aereas)
  const datesFiltered = (): Array<Data> => {
    if (initialDateInput) {
      if (finalDateInput) {
        const initialDate = moment(initialDateInput),
          finalDate = moment(finalDateInput);

        if (initialDate.isAfter(finalDate)) {
          return data.filter(
            data =>
              data.dtNotific &&
              data.dtNotific.isBetween(
                finalDate,
                initialDate.add(1, 'day'),
                undefined,
                '[]'
              )
          );
        }

        return data.filter(
          data =>
            data.dtNotific &&
            data.dtNotific.isBetween(
              initialDate,
              finalDate.add(1, 'day'),
              undefined,
              '[]'
            )
        );
      }

      return data.filter(
        data =>
          data.dtNotific &&
          data.dtNotific.isSameOrAfter(moment(initialDateInput))
      );
    }

    if (initialMonth) {
      if (finalMonth) {
        return data.filter(
          data =>
            data.dtNotific &&
            (data.dtNotific.month() == initialMonth ||
              data.dtNotific.month() == finalMonth)
        );
      }

      return data.filter(
        data => data.dtNotific && data.dtNotific.month() == initialMonth
      );
    }

    if (initialEpiWeek) {
      const epiWeekInitialYear = initialEpiWeek == 1 ? '2017' : '2018';
      const epiWeekFinalYear = '2018';

      const dateInfoInitialEpiWeek = epidemiologicalWeeksForTest.find(week => {
        return week.numero == initialEpiWeek;
      });

      const initialDate = `${epiWeekInitialYear}-${dateInfoInitialEpiWeek &&
        dateInfoInitialEpiWeek.inicio.mes}-${dateInfoInitialEpiWeek &&
        dateInfoInitialEpiWeek.inicio.dia}`;
      let finalDate = `${epiWeekFinalYear}-${dateInfoInitialEpiWeek &&
        dateInfoInitialEpiWeek.final.mes}-${dateInfoInitialEpiWeek &&
        dateInfoInitialEpiWeek.final.dia}`;

      if (finalEpiWeek) {
        const dateInfoFinalEpiWeek = epidemiologicalWeeksForTest.find(week => {
          return week.numero == finalEpiWeek;
        });

        finalDate = `${epiWeekFinalYear}-${dateInfoFinalEpiWeek &&
          dateInfoFinalEpiWeek.final.mes}-${dateInfoFinalEpiWeek &&
          dateInfoFinalEpiWeek.final.dia}`;
      }

      const dataEpiWeekFiltered = data.filter(
        data =>
          data.dtNotific &&
          data.dtNotific.isBetween(initialDate, finalDate, undefined, '[]')
      );

      return dataEpiWeekFiltered;
    }

    return data;
  };

  const filters = (data: Data) => {
    let f = true;

    // Autoctones filter
    f =
      f &&
      ((autoctonesCase && String(data.TPAUTOCTO) === '1') ||
        (!autoctonesCase && String(data.TPAUTOCTO) !== '1'));

    // Analysis filter
    f =
      f &&
      (analysisFilter === Analysis.All ||
        (analysisFilter === Analysis.Clinical &&
          String(data.CRITERIO) === '2') ||
        (analysisFilter === Analysis.Exam && String(data.CRITERIO) === '1'));

    // Final Classification filter
    f =
      f &&
      (finalClassificationFilter === FinalClassification.All ||
        (finalClassificationFilter === FinalClassification.Alarming &&
          String(data.CLASSI_FIN) === '11') ||
        (finalClassificationFilter === FinalClassification.Severe &&
          String(data.CLASSI_FIN) === '12') ||
        (finalClassificationFilter === FinalClassification.Simple &&
          String(data.CLASSI_FIN) === '10'));

    // Case Evolution filter
    f =
      f &&
      (caseEvolutionFilter === CaseEvolution.All ||
        (caseEvolutionFilter === CaseEvolution.Cure &&
          String(data.EVOLUCAO) === '1') ||
        (caseEvolutionFilter === CaseEvolution.DeathFromDengue &&
          String(data.EVOLUCAO) === '2') ||
        (caseEvolutionFilter === CaseEvolution.DeathFromOthers &&
          String(data.EVOLUCAO) === '3') ||
        (caseEvolutionFilter === CaseEvolution.Ignored &&
          String(data.EVOLUCAO) === '9'));

    return f;
  };

  const classes = useStyles();

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
            <FormControlLabel
              className={classes.checkBox}
              control={
                <Checkbox
                  onChange={showClusterOnChange}
                  checked={showCluster}
                />
              }
              label={'Mostrar Clusters'}
            />
            <br />
            <FormControlLabel
              className={classes.checkBox}
              control={
                <Checkbox
                  onChange={autoctonesCaseOnChange}
                  checked={autoctonesCase}
                />
              }
              label={'Casos Autóctones'}
            />
            <br />

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Notificações</FormLabel>
              <RadioGroup
                aria-label="notificações"
                row
                onChange={(e: any) => setNotificationsFilter(e.target.value)}
                value={notificationsFilter}
              >
                <FormControlLabel
                  value={NotificationsFilter.All}
                  control={<Radio />}
                  label="Todas"
                />
                <FormControlLabel
                  value={NotificationsFilter.Positives}
                  control={<Radio />}
                  label="Positivas"
                />
                <FormControlLabel
                  value={NotificationsFilter.Suspects}
                  control={<Radio />}
                  label="Suspeitas"
                />
              </RadioGroup>
            </FormControl>
            <br />
            {notificationsFilter === NotificationsFilter.Positives ? (
              <>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Análises</FormLabel>
                  <RadioGroup
                    aria-label="análises"
                    row
                    onChange={(e: any) => setAnalysisFilter(e.target.value)}
                    value={analysisFilter}
                  >
                    <FormControlLabel
                      value={Analysis.All}
                      control={<Radio />}
                      label="Todas"
                    />
                    <FormControlLabel
                      value={Analysis.Clinical}
                      control={<Radio />}
                      label="Clínica"
                    />
                    <FormControlLabel
                      value={Analysis.Exam}
                      control={<Radio />}
                      label="Exame"
                    />
                  </RadioGroup>
                </FormControl>
                <br />
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Classificação Final</FormLabel>
                  <RadioGroup
                    aria-label="classificação final"
                    row
                    onChange={(e: any) =>
                      setFinalClassificationFilter(e.target.value)
                    }
                    value={finalClassificationFilter}
                  >
                    <FormControlLabel
                      value={FinalClassification.All}
                      control={<Radio />}
                      label="Todas"
                    />
                    <FormControlLabel
                      value={FinalClassification.Simple}
                      control={<Radio />}
                      label="Simples"
                    />
                    <FormControlLabel
                      value={FinalClassification.Alarming}
                      control={<Radio />}
                      label="Alarmante"
                    />
                    <FormControlLabel
                      value={FinalClassification.Severe}
                      control={<Radio />}
                      label="Grave"
                    />
                  </RadioGroup>
                </FormControl>
                <br />
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Evolução no Caso</FormLabel>
                  <RadioGroup
                    aria-label="evolução no caso"
                    row
                    onChange={(e: any) =>
                      setCaseEvolutionFilter(e.target.value)
                    }
                    value={caseEvolutionFilter}
                  >
                    <FormControlLabel
                      value={CaseEvolution.All}
                      control={<Radio />}
                      label="Todos"
                    />
                    <FormControlLabel
                      value={CaseEvolution.Cure}
                      control={<Radio />}
                      label="Cura"
                    />
                    <FormControlLabel
                      value={CaseEvolution.DeathFromDengue}
                      control={<Radio />}
                      label="Ób. Dengue"
                    />
                    <FormControlLabel
                      value={CaseEvolution.DeathFromOthers}
                      control={<Radio />}
                      label="Ób. Outros"
                    />
                    <FormControlLabel
                      value={CaseEvolution.Ignored}
                      control={<Radio />}
                      label="Ignorado"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            ) : null}
            {
              <div>
                <FormControl className={classes.formControlDate}>
                  <TextField
                    id="initialDate"
                    label="Data Inicial"
                    type="date"
                    onChange={e => setInitialDateInput(e.target.value)}
                    value={initialDateInput}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: '2018-01-01',
                      max: '2018-12-31'
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControlDate}>
                  <TextField
                    id="finalDate"
                    label="Data Final"
                    type="date"
                    onChange={e => setFinalDateInput(e.target.value)}
                    value={finalDateInput}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: '2018-01-01',
                      max: '2018-12-31'
                    }}
                  />
                </FormControl>
              </div>
            }
            {
              <div>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel htmlFor="Mês Inicial">Mês Inicial</InputLabel>
                  <Select
                    value={initialMonth}
                    onChange={e => setInitialMonth(e.target.value)}
                    inputProps={{
                      name: 'initialMonth',
                      id: 'initial-month'
                    }}
                  >
                    {months.map(month => {
                      return (
                        <MenuItem
                          key={`initial-month-${month.value}`}
                          value={month.value}
                        >
                          {month.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControlSelect}>
                  <InputLabel htmlFor="Mês Final">Mês Final</InputLabel>
                  <Select
                    value={finalMonth}
                    onChange={e => setFinalMonth(e.target.value)}
                    inputProps={{
                      name: 'finalMonth',
                      id: 'final-month'
                    }}
                  >
                    {finalMonths.map(month => {
                      return (
                        <MenuItem
                          key={`final-month-${month.value}`}
                          value={month.value}
                        >
                          {month.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            }
            {
              <div>
                <form className={classes.root} autoComplete="off" noValidate>
                  <FormControl className={classes.formControlSelect}>
                    <InputLabel htmlFor="Semana Inicial">
                      Semana Inicial
                    </InputLabel>
                    <Select
                      value={initialEpiWeek}
                      onChange={e => setInitialEpiWeek(e.target.value)}
                      inputProps={{
                        name: 'initialEpiWeek',
                        id: 'initial-epi-week'
                      }}
                    >
                      {epidemiologicalWeeksForTest.map(semana => {
                        return (
                          <MenuItem
                            key={`initial-epiWeek-${semana.numero}`}
                            value={semana.numero}
                          >
                            {semana.numero}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControlSelect}>
                    <InputLabel htmlFor="Semana Final">Semana Final</InputLabel>
                    <Select
                      value={finalEpiWeek}
                      onChange={e => setFinalEpiWeek(e.target.value)}
                      inputProps={{
                        name: 'finalEpiWeek',
                        id: 'final-epi-week'
                      }}
                    >
                      {epidemiologicalWeeksFinal.map(semana => {
                        return (
                          <MenuItem
                            key={`final-epiWeek-${semana.numero}`}
                            value={semana.numero}
                          >
                            {semana.numero}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </form>
              </div>
            }
            <FormControl component="fieldset" className={classes.formControl}>
              <TextField
                label="Filtro por Bairro"
                className={classes.textField}
                margin="none"
              />
              <br />
              <TextField
                label="Filtro por Idade"
                className={classes.textField}
                margin="none"
              />
            </FormControl>
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

            if (map && polygons.current.length === 0) {
              const infoWindow = new googleMaps.InfoWindow();

              polygons.current = polygonsData.map(({ id, paths }) => {
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
                polygon.addListener('click', (e: any) => {
                  const latLng = e.latLng;
                  infoWindow.setContent(id);
                  infoWindow.setPosition(latLng);
                  infoWindow.open(map);
                });
                return { id, polygon };
              });
            }

            markers = datesFiltered()
              .filter(filters)
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
                  if (polygons.current.length > 0) {
                    polygons.current.forEach(({ id, polygon }) => {
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
