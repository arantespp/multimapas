import React, { useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import XLSX from "xlsx";
// import utf8 from "utf8";

import GetLatLng from "../GetLatLng";

import "./styles.scss";

interface Row {
  [key: string]: string | number;
}

const getHeaders = (json: Row[]): string[] => {
  const headers: any = json.reduce((acc, row) => {
    Object.keys(row).forEach(key => (acc[key] = 1));
    return acc;
  }, {});
  return Object.keys(headers);
};

const checkIfLatLngExist = (json: Row[]): boolean => {
  return json.reduce<boolean>((acc, row) => {
    return acc && !!row.latitude && !!row.longitude;
  }, true);
};

const Multimapa: React.FC = () => {
  const [data, setData] = useState<string>(JSON.stringify([]));
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [header, setHeader] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGetLatLng, setShowGetLatLng] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const multimapaOnClick = () => {
    setIsDropdownActive(false);
  };

  const dropdownOnClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsDropdownActive(!isDropdownActive);
  };

  const dropdownHeaderOnClick = (header: string) => () => setHeader(header);

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
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json: Array<{ [key: string]: any }> = XLSX.utils
        .sheet_to_json(worksheet)
        // add id to json if it not exists
        .map((row, index) => ({ id: index, ...row }));

      setData(JSON.stringify(json));

      setHeaders(getHeaders(json));

      setLoading(true);

      if (!checkIfLatLngExist(json)) {
        setShowGetLatLng(true);
      } else {
        setLoading(false);
      }
    };
  };

  const closeGetLatLng = () => {
    setShowGetLatLng(false);
    setLoading(false);
  };

  const downloadData = () => {
    const workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Dados");
    const worksheet = XLSX.utils.json_to_sheet(JSON.parse(data));
    workbook.Sheets["Dados"] = worksheet;
    XLSX.writeFile(workbook, `${fileName.split(".")[0]}_lat-lng.xlsx`);
  };

  return (
    <div className="Multimapa" onClick={multimapaOnClick}>
      <GetLatLng
        isActive={showGetLatLng}
        data={JSON.parse(data)}
        headers={headers}
        setData={setData}
        close={closeGetLatLng}
        downloadData={downloadData}
      />
      <nav className="panel">
        <div className="panel-block">
          <input
            style={{ display: "none" }}
            accept=".xlsx, .xls, .csv"
            type="file"
            id="fileInput"
            ref={fileRef}
            onChange={fileInputOnChange}
          />
          <button
            className={`button is-primary is-fullwidth ${
              loading ? "is-loading" : ""
            }`}
            onClick={openFileOnClick}
          >
            Carregar Dados
          </button>
        </div>
        <p className="panel-heading">{`Dados Geolocalizados ${
          fileName ? "- " + fileName : ""
        }`}</p>
        <div className="panel-block">
          <p className="control has-icons-left">
            <input
              className="input is-small"
              type="text"
              placeholder="procurar"
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon="search" />
            </span>
          </p>
        </div>
        <div className="panel-tabs">
          <div
            className={`dropdown ${isDropdownActive ? "is-active" : ""}`}
            onClick={dropdownOnClick}
          >
            <div className="dropdown-trigger">
              <button
                className="button"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span>{`Agrupar por ${header ? ": " + header : ""}`}</span>
                <span className="icon is-small">
                  <FontAwesomeIcon icon="angle-down" />
                </span>
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div
                className="dropdown-content"
                style={{ height: "300px", overflowY: "scroll" }}
              >
                <a
                  href="#"
                  className={`dropdown-item ${!!!header ? "is-active" : ""}`}
                  onClick={dropdownHeaderOnClick("")}
                >
                  Nenhum
                </a>
                <hr className="dropdown-divider" />
                {headers.map(header => (
                  <a
                    href="#"
                    key={header}
                    className="dropdown-item"
                    onClick={dropdownHeaderOnClick(header)}
                  >
                    {header}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Multimapa;
