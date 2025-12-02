import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './ADEX/Router.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
