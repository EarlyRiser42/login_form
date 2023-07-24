import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import {HashRouter as Router} from "react-router-dom";
import fbase from './fbase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
          <App />
      </Router>

  </React.StrictMode>
);

