import React from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';

// Configure dayjs plugins globally
dayjs.extend(utc);
dayjs.extend(timezone);

// Provide a global Buffer polyfill for browser environment
window.Buffer = Buffer;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
