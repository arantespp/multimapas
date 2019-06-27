import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider, { Range } from 'rc-slider';
import Modal from 'react-modal';

import './styles.scss';
import 'rc-slider/assets/index.css';

interface Props {
  numberOfMaps: number;
  numberOfMapsOnChange: (value: number) => void;
  mapsHeight: number;
  mapsHeightOnChange: (value: number) => void;
  mapsWidth: number;
  mapsWidthOnChange: (value: number) => void;
}

const Menu: React.FC<Props> = ({
  numberOfMaps,
  numberOfMapsOnChange,
  mapsHeight,
  mapsHeightOnChange,
  mapsWidth,
  mapsWidthOnChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfMapsIntern, setNumberOfMapsIntern] = useState(numberOfMaps);
  const [mapsHeightIntern, setMapsHeightIntern] = useState(mapsHeight);
  const [mapsWidthIntern, setMapsWidthIntern] = useState(mapsWidth);

  const menuOnClick = () => {
    setIsOpen(!isOpen);
  };

  const numberOfMapsSliderOnChange = (value: number) => {
    setNumberOfMapsIntern(value);
  };

  const mapsHeightSliderOnChange = (value: number) => {
    setMapsHeightIntern(value);
  };

  const mapsWidthSliderOnChange = (value: number) => {
    setMapsWidthIntern(value);
  };

  return (
    <div className="Menu">
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <span>Número de Mapas: {numberOfMapsIntern}</span>
        <Slider
          min={1}
          max={12}
          defaultValue={numberOfMaps}
          step={1}
          onChange={numberOfMapsSliderOnChange}
          onAfterChange={numberOfMapsOnChange}
        />
        <span>Altura: {mapsHeightIntern}px</span>
        <Slider
          min={100}
          max={2000}
          defaultValue={mapsHeight}
          step={10}
          onChange={mapsHeightSliderOnChange}
          onAfterChange={mapsHeightOnChange}
        />
        <span>Largura: {mapsWidthIntern}px</span>
        <Slider
          min={100}
          max={2000}
          defaultValue={mapsWidth}
          step={10}
          onChange={mapsWidthSliderOnChange}
          onAfterChange={mapsWidthOnChange}
        />
      </Modal>
      <div className="button" onClick={menuOnClick}>
        <FontAwesomeIcon className="icon" icon="cogs" />
      </div>
    </div>
  );
};

export default Menu;
