import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faBars,
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import Multimapa from './components/Multimapa';

import './App.scss';

library.add(faAngleDown, faBars, faSearch, faTimes);

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="">
        <span className="">Multimapa App</span>
      </header>
      <main className="">
        <Multimapa />
      </main>
    </div>
  );
};

export default App;
