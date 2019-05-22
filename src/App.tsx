import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

import Multimapa from "./components/Multimapa";

import "./App.scss";

library.add(faAngleDown, faSearch);

const App: React.FC = () => {
  return (
    <div className="App">
      <header
        className="is-flex header"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <h1 className="is-size-3 has-text-weight-normal">Multimapa</h1>
      </header>
      <main className="main container is-fullhd">
        <Multimapa />
      </main>
    </div>
  );
};

export default App;
