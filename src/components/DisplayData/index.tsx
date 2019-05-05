import React from "react";

interface Row {
  [key: string]: string | number;
}

const DisplayData: React.FC<{ data: Row[]; headers: string[] }> = ({
  data,
  headers
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {headers.map((header, headerIndex) => (
              <td key={`row-${rowIndex}-${headerIndex}`}>
                <span className="is-size-7">{row[header]}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayData;
