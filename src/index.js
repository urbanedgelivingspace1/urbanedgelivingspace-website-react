// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles

// Render the main App component into the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Global container for smooth transitions and consistent layout */}
    <div className="app-container">
      <App />
    </div>
  </React.StrictMode>
);
