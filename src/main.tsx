import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((registrationError) => {
      console.error('Service worker registration failed:', registrationError);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <App />
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
