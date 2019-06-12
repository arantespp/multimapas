import React, { useRef, useState } from 'react';

import XLSX from 'xlsx';

import { Data, LoadedData } from '../../interfaces/data';

import './styles.scss';

interface Props {
  setData: React.Dispatch<React.SetStateAction<Array<Data>>>;
}

const transformData = (data: LoadedData, id: number): Data => {
  return { ...data, id };
};

const LoadData: React.FC<Props> = ({ setData }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const openFileOnClick = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.click();
    }
  };

  const fileInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!!!event.target.files) {
      return;
    }

    setLoading(true);

    const file = event.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const data = reader.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils
        .sheet_to_json<LoadedData>(worksheet)
        .map(transformData);

      setLoading(false);
      setData(json);
    };
  };

  return (
    <div className="LoadData">
      <input
        style={{ display: 'none' }}
        accept=".xlsx, .xls, .csv"
        type="file"
        id="fileInput"
        ref={fileRef}
        onChange={fileInputOnChange}
      />
      <button onClick={openFileOnClick}>Carregar Dados</button>
    </div>
  );
};

export default LoadData;
