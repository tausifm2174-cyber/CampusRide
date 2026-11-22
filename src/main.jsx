import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { RideProvider } from './context/RideContext';
import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RideProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </RideProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
