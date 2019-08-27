import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';

import { Data } from '../../interfaces/data';

import './styles.scss';

const notifyingUnits: { [key: string]: string } = {
  '2028514': 'USF JARDIM MUNIQUE',
  '2028522': 'USF PRESIDENTE COLLOR',
  '2028875': 'USF AGUA VERMELHA',
  '2033992': 'UBS LUIZ MAIA',
  '2039427': 'UBS BENJAMIN LOPES OSORES',
  '2039435': 'UBS VIRIATO FERNANDES NUNES',
  '2039443': 'UBS WILSON POZZI',
  '2040360': 'UBS AZULVILLE DR ROMEU DE CRESCI',
  '2040778': 'UBS ERNESTO PEREIRA LOPES',
  '2040921': 'UBS SAO JOSE DR LUIZ VALENTIE DE OLIVEIRA',
  '6367194': 'VIGILANCIA EPIDEMIOLOGICA - SMS',
  '2041278': 'UBS LAURO CORSI',
  '2041286': 'USF ROMEU TORTORELLI',
  '2046660': 'UBS ARSENIO AGNESINE',
  '2046970': 'UBS JOAO SABINO',
  '2057638': 'UBS DANTE ERBOLATO',
  '2063123': 'USF ANTENOR GARCIA',
  '2083558': 'USF JOCKEY CLUBE',
  '3034399': 'USF JARDIM SAO CARLOS',
  '3034410': 'UBS VILA ISABEL',
  '3155773': 'UBS BOTAFOGO',
  '3738019': 'USF GONZAGA',
  '3983617': 'USF SANTA ANGELINA',
  '5467195': 'USF JARDIM GUANABARA',
  '5544157': 'USF CIDADE ARACY EQUIPE 1',
  '5931606': 'USF CIDADE ARACY EQUIPE 2',
  '5974739': 'USF JARDIM CRUZEIRO DO SUL EQUIPE 1',
  '6022197': 'USF JARDIM CRUZEIRO DO SUL EQUIPE 2',
  '6593135': 'USF ASTOLFO LUIZ DO PRADO',
  '6847919': 'USF JOSE FERNANDO PETRILLI FILHO',
  '7961553': 'USF ITAMARATI EQUIPE 38',
  '9113363': 'USF JARDIM SAO RAFAEL',
  '9057919': 'USF SAO CARLOS VIII',
  '9437800': 'USF ARNON DE MELLO',
  '7116705': 'UPA ARACY',
  '2033623': 'UPA VILA PRADO',
  '7684371': 'UPA SANTA FELICIA',
  '2057239': 'LABORATORIO MARICONDI',
  '2083507': 'UNILAB LABORATORIO DE ANALISES CLINICAS',
  '2080931': 'SANTA CASA DE SAO CARLOS',
  '7431589': 'CAIC - CENTRO DE ATEND INF CRON S CARLOS ENF ANA CLAUDIA LUCATTO',
  '5586348': 'HOSPITAL UNIVERSITARIO DA UFSCAR PROF DR HORACIO C PANEPUCCI',
  '2057409': 'LABORATORIO DELTHA',
  '2083299': 'HOSPITAL UNIMED SAO CARLOS'
};

const sex: { [key: string]: string } = {
  M: 'MASCULINO',
  F: 'FEMININO',
  I: 'IGNORADO'
};

const pregnant: { [key: string]: string } = {
  '1': '1º TRIMESTRE',
  '2': '2º TRIMESTRE',
  '3': '3º TRIMESTRE',
  '4': 'IDADE GESTACIONAL IGNORADA',
  '5': 'NÃO',
  '6': 'NÃO SE APLICA',
  '9': 'IGNORADO'
};

const zone: { [key: string]: string } = {
  '1': 'URBANA',
  '2': 'RURAL',
  '3': 'PERIURBANA',
  '9': 'IGNORADO'
};

const hospitalization: { [key: string]: string } = {
  '1': 'SIM',
  '2': 'NÃO',
  '9': 'IGNORADO'
};

const autocto: { [key: string]: string } = {
  '1': 'SIM',
  '2': 'NÃO',
  '9': 'INDETERMINADO'
};

const finalClassification: { [key: string]: string } = {
  '5': 'DESCARTADO',
  '10': 'DENGUE',
  '11': 'DENGUE COM SINAIS DE ALARME',
  '12': 'DENGUE GRAVE',
  '8': 'SISTEMA ENCERROU A FICHA AUTOMATICAMENTE'
};

const criterion: { [key: string]: string } = {
  '1': 'LABORATÓRIO',
  '2': 'CLÍNICO-EPIDEMIOLÓGICO',
  '3': 'EM INVESTIGAÇÃO'
};

const caseEvolution: { [key: string]: string } = {
  '1': 'CURA',
  '2': 'ÓBITO PELO AGRAVO',
  '3': 'ÓBITO POR OUTRAS CAUSAS',
  '4': 'ÓBITO EM INVESTIGAÇÃO',
  '9': 'IGNORADO'
};

const fields = {
  DT_NOTIFIC: 'DATA DE NOTIFICAÇÃO',
  SEM_NOT: 'SEMANA EPIDEMIOLÓGICA DE NOTIFICAÇÃO',
  ID_UNIDADE: 'IDENTIFICAÇÃO DA UNIDADE NOTIFICADORA',
  DT_SIN_PRI: 'DATA DE INÍCIO DOS PRIMEIROS SINTOMAS',
  SEM_PRI: 'SEMANA EPIDEMIOLÓGICA DE INÍCIO DE SINTOMAS',
  NU_IDADE_N: 'IDADE',
  CS_SEXO: 'SEXO',
  CS_GESTANT: 'GESTANTE',
  NM_BAIRRO: 'BAIRRO',
  NM_LOGRADO: 'LOGRADOURO (RUA, AVENIDA, ...)',
  NU_NUMERO: 'NÚMERO',
  NM_COMPLEM: 'COMPLEMENTO (APTO, CASA,...)',
  CS_ZONA: 'ZONA ',
  HOSPITALIZ: 'HOSPITALIZAÇÃO',
  TPAUTOCTO: 'CASO AUTÓCTONE',
  CLASSI_FIN: 'CLASSIFICAÇÃO ',
  CRITERIO: 'CRITÉRIO DE CONFIRMAÇÃO/DESCARTE',
  EVOLUCAO: 'EVOLUÇÃO DO CASO',
  block: 'QUADRA'
};

const DataDetailsModal: React.FC<{
  close: () => void;
  data: Data | null;
}> = ({ close, data }) => {
  const fieldValues = (field: keyof typeof fields) => {
    const dataField = String(data![field as keyof Data] || '-');
    switch (field) {
      case 'SEM_NOT':
      case 'SEM_PRI':
        return dataField.slice(-2);
      case 'ID_UNIDADE':
        return notifyingUnits[dataField];
      case 'CS_SEXO':
        return sex[dataField];
      case 'CS_GESTANT':
        return pregnant[dataField];
      case 'CS_ZONA':
        return zone[dataField];
      case 'HOSPITALIZ':
        return hospitalization[dataField];
      case 'TPAUTOCTO':
        return autocto[dataField] || 'SEM VALOR NA PLANILHA';
      case 'CLASSI_FIN':
        return finalClassification[dataField];
      case 'CRITERIO':
        return criterion[dataField];
      case 'EVOLUCAO':
        return caseEvolution[dataField];
      default:
        return dataField;
    }
  };

  return (
    <Modal
      isOpen={!!data}
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 2147483647,
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        },
        content: {
          zIndex: 2147483647,
          maxHeight: '90vh',
          maxWidth: '90vw',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'auto'
        }
      }}
    >
      <div className="DataDetailsModal">
        <span
          style={{ alignSelf: 'flex-end', cursor: 'pointer' }}
          onClick={close}
        >
          <FontAwesomeIcon icon="times" />
        </span>
        <span className="modal-title">Detalhes</span>
        <div className="block">
          {data &&
            (Object.keys(fields) as Array<keyof typeof fields>).map(field => {
              return (
                <div className="block-line">
                  <span className="field">{fields[field]}:</span>
                  <span className="field-value">{fieldValues(field)}</span>
                </div>
              );
            })}
        </div>
        <button className="button" onClick={close}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default DataDetailsModal;
