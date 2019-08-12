import React, { useState } from 'react';

import DataDetailsModal from '../DataDetailsModal';
import LoadData from '../LoadData';
import Maps from '../Maps';
import Menu from '../Menu';

import { Data } from '../../interfaces/data';

import './styles.scss';

const Multimapa: React.FC = () => {
  const [data, setData] = useState<Array<Data>>([
    // {
    //   ACIDO_PEPT: '2',
    //   ARTRALGIA: '2',
    //   ARTRITE: '2',
    //   AUTO_IMUNE: '2',
    //   CEFALEIA: '1',
    //   CLASSI_FIN: '5',
    //   CONJUNTVIT: '2',
    //   CRITERIO: '1',
    //   CS_ESCOL_N: '8',
    //   CS_FLXRET: '0',
    //   CS_GESTANT: '9',
    //   CS_RACA: '9',
    //   CS_SEXO: 'F',
    //   CS_ZONA: '1',
    //   DIABETES: '2',
    //   DOR_COSTAS: '2',
    //   DOR_RETRO: '2',
    //   DT_DIGITA: 43311,
    //   DT_ENCERRA: 43294,
    //   DT_INVEST: 43276,
    //   DT_NOTIFIC: 43276,
    //   DT_SIN_PRI: 43269,
    //   DT_SORO: 43276,
    //   EVOLUCAO: '1',
    //   EXANTEMA: '1',
    //   FEBRE: '1',
    //   HEMATOLOG: '2',
    //   HEPATOPAT: '2',
    //   HIPERTENSA: '2',
    //   HISTOPA_N: '4',
    //   HOSPITALIZ: '2',
    //   IDENT_MICR: '0000000000004',
    //   ID_AGRAVO: 'A90',
    //   ID_BAIRRO: '47',
    //   ID_MN_RESI: '354890',
    //   ID_MUNICIP: '354890',
    //   ID_OCUPA_N: '223620',
    //   ID_PAIS: '1',
    //   ID_REGIONA: '1337',
    //   ID_RG_RESI: '1337',
    //   ID_UNIDADE: '2083507',
    //   IMUNOH_N: '4',
    //   LACO: '2',
    //   LEUCOPENIA: '2',
    //   MIALGIA: '1',
    //   NAUSEA: '2',
    //   NM_BAIRRO: 'MONTEIRO VL',
    //   NM_COMPLEM: 'APTO 203 BL 1',
    //   NM_LOGRADO: 'RUA JOSE RODRIGUES SAMPAIO',
    //   NU_ANO: '2018',
    //   NU_DDD_TEL: '16',
    //   NU_IDADE_N: 4031,
    //   NU_NOTIFIC: '5709800',
    //   NU_NUMERO: '177',
    //   NU_TELEFON: '34131868',
    //   PETEQUIA_N: '2',
    //   RENAL: '2',
    //   RESUL_NS1: '4',
    //   RESUL_PCR_: '4',
    //   RESUL_SORO: '2',
    //   RESUL_VI_N: '4',
    //   SEM_NOT: '201826',
    //   SEM_PRI: '201825',
    //   SG_UF: '35',
    //   SG_UF_NOT: '35',
    //   TP_NOT: '2',
    //   TP_SISTEMA: '2',
    //   VOMITO: '2',
    //   id: 720,
    //   latitude: -22.0250896,
    //   longitude: -47.888052500000015
    // }
  ]);
  const [dataDetails, setDataDetails] = useState<Data | null>(null);
  const [numberOfMaps, setNumberOfMaps] = useState(2);
  const [mapsHeight, setMapsHeight] = useState(window.innerHeight - 60);
  const [mapsWidth, setMapsWidth] = useState(window.innerWidth / 2 - 20);

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
