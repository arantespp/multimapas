import React, { useState } from 'react';

import DataDetailsModal from '../DataDetailsModal';
import LoadData from '../LoadData';
import Maps from '../Maps';
import Menu from '../Menu';

import { Data } from '../../interfaces/data';

import './styles.scss';

const Multimapa: React.FC = () => {
  const [data, setData] = useState<Array<Data>>([]);
  const [dataDetails, setDataDetails] = useState<Data | null>(null);
  const [numberOfMaps, setNumberOfMaps] = useState(1);
  const [mapsHeight, setMapsHeight] = useState(700);
  const [mapsWidth, setMapsWidth] = useState(500);

  const closeDataDetailsModal = () => {
    setDataDetails(null);
  };

  const numberOfMapsOnChange = (value: number) => {
    setNumberOfMaps(value);
  };

  const mapsHeightOnChange = (value: number) => {
    setMapsHeight(value);
  };

  const mapsWidthOnChange = (value: number) => {
    setMapsWidth(value);
  };

  const menuProps = {
    numberOfMaps,
    numberOfMapsOnChange,
    mapsHeight,
    mapsHeightOnChange,
    mapsWidth,
    mapsWidthOnChange
  };

  if (data.length === 0) {
    return (
      <div className="LoadData">
        <LoadData setData={setData} />
      </div>
    );
  }

  return (
    <>
      <Menu {...menuProps} />
      <DataDetailsModal data={dataDetails} close={closeDataDetailsModal} />
      <div className="Multimapa">
        {[...Array(numberOfMaps)].map((key, index) => (
          <Maps
            key={index}
            data={data}
            chosenFiltersDefault={['Positivo']}
            openDataDetailsModal={setDataDetails}
            height={mapsHeight}
            width={mapsWidth}
          />
        ))}
      </div>
    </>
  );
};

export default Multimapa;
