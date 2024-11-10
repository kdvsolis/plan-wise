import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.min.js';

// Type for the root element (null can be returned in case of failure to find the element)
const rootElement = document.getElementById('root') as HTMLElement | null;

// Ensure rootElement exists before calling ReactDOM.createRoot
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Measure performance and optionally send to an analytics endpoint
//reportWebVitals();
