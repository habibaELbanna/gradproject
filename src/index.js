import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Routing';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);