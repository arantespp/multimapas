import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';

import { Data } from '../../interfaces/data';

import './styles.scss';

interface Block {
  blockName: string;
  fields: Array<keyof Data>;
}

const blocks: Block[] = [
  {
    blockName: 'Localização',
    fields: ['NM_LOGRADO', 'NU_NUMERO', 'NM_COMPLEM', 'NM_BAIRRO']
  },
  {
    blockName: 'Paciente',
    fields: [
      'DT_NOTIFIC',
      'SEM_NOT',
      'ID_UNIDADE',
      'DT_SIN_PRI',
      'SEM_PRI',
      'NU_IDADE_N',
      'CS_SEXO',
      'CS_GESTANT'
    ]
  },
  {
    blockName: 'Clínico',
    fields: ['HOSPITALIZ', 'TPAUTOCTO', 'CLASSI_FIN']
  }
];

const DataDetailsModal: React.FC<{
  close: () => void;
  data: Data | null;
}> = ({ close, data }) => {
  return (
    <Modal
      isOpen={!!data}
      ariaHideApp={false}
      style={{
        overlay: { zIndex: 99 },
        content: {
          zIndex: 99,
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
        {!!data &&
          blocks.map(({ blockName, fields }) => (
            <div key={blockName} className="block">
              <span className="block-title">{blockName}</span>
              <ul>
                {fields.map(field => (
                  <li key={field} className="block-line">
                    <span className="field">{field}:</span>
                    <span className="field-value">
                      {!!data[field] ? data[field] : '-'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        <button className="button" onClick={close}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default DataDetailsModal;
