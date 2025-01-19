import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router';

import { routes } from '@/config/routes';

import './register-service-worker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={createHashRouter(routes)} />
  </StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
