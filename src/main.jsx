import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { KeycloakProvider } from './providers/KeycloakProvider.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </BrowserRouter>
);
