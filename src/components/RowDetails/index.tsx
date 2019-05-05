import React from "react";

import "./styles.scss";

interface Row {
  [key: string]: string | number;
}

const RowDetails: React.FC<{
  close: () => void;
  isActive: boolean;
  row: Row | null;
}> = ({ isActive, close, row }) => {
  return (
    <div className={`modal ${isActive && "is-active"}`}>
      <div className="modal-background" onClick={close} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Detalhes</p>
          <button className="delete" aria-label="close" onClick={close} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            <ol className="is-upper-alpha">
              {Object.entries(row || {}).map(([key, value]) => {
                return (
                  <li>
                    <strong>{key}:</strong> {value}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={close}>
            Fechar
          </button>
        </footer>
      </div>
      <button className="modal-close is-large" aria-label="close" />
    </div>
  );
};

export default RowDetails;
