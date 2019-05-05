import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

import Multimapa from "./components/Multimapa";

import "./App.scss";

library.add(faAngleDown, faSearch);

const App: React.FC = () => {
  return (
    <main className="App container">
      <Multimapa />
    </main>
  );
};

export default App;
