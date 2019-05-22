import React, { useRef, useState } from "react";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import XLSX from "xlsx";
// import utf8 from "utf8";

import GetLatLng from "../GetLatLng";
import Maps from "../Maps";
import RowDetails from "../RowDetails";

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
  // const [header, setHeader] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGetLatLng, setShowGetLatLng] = useState(false);
  const [activeGetLatLng] = useState(false);
  const [rowDetails, setRowDetails] = useState<Row | null>(null);
  const [markersColors, setMarkersColors] = useState({
    green: true,
    yellow: true,
    blue: true
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const multimapaOnClick = () => {
    setIsDropdownActive(false);
  };

  // const dropdownOnClick = (
  //   event: React.MouseEvent<HTMLDivElement, MouseEvent>
  // ) => {
  //   event.stopPropagation();
  //   setIsDropdownActive(!isDropdownActive);
  // };

  // const dropdownHeaderOnClick = (header: string) => () => setHeader(header);

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

      if (!checkIfLatLngExist(json) && activeGetLatLng) {
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

  const closeRowDetails = () => {
    setRowDetails(null);
  };

  const checkboxOnChange = (color: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarkersColors({ ...markersColors, [color]: event.target.checked });
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
      <RowDetails
        isActive={!!rowDetails}
        row={rowDetails}
        close={closeRowDetails}
      />
      <div className="columns is-variable is-1-mobile">
        <nav className="panel column is-narrow is-two-fifths-tablet is-one-quarter-desktop">
          <p className="panel-heading has-text-centered	">{`Dados Geolocalizados ${
            fileName ? "- " + fileName : ""
          }`}</p>
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
          <div className="checkbox-container">
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    defaultChecked={markersColors.blue}
                    type="checkbox"
                    onChange={checkboxOnChange("blue")}
                  />
                  <img
                    src={
                      "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                    height="16px"
                    alt="Azul"
                  />
                  Notificações Negativas
                </label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    defaultChecked={markersColors.yellow}
                    type="checkbox"
                    onChange={checkboxOnChange("yellow")}
                  />
                  <img
                    src={
                      "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    }
                    height="16px"
                    alt="Amarelo"
                  />
                  Notificações Positivas Autóctones
                </label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    defaultChecked={markersColors.green}
                    type="checkbox"
                    onChange={checkboxOnChange("green")}
                  />
                  <img
                    src={
                      "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    }
                    height="16px"
                    alt="Verde"
                  />
                  Notificações Positivas não Autóctones
                </label>
              </div>
            </div>
          </div>

          {/* const blueMarker = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"; */}
          {/* const yellowMarker = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
const greenMarker = "https://maps.google.com/mapfiles/ms/icons/green-dot.png"; */}

          {/* <div className="panel-block">
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
        </div> */}
        </nav>
        <div id="maps" className="column">
          <Maps
            data={JSON.parse(data)}
            setRowDetails={setRowDetails}
            markersColors={markersColors}
          />
        </div>
      </div>
    </div>
  );
};

export default Multimapa;
