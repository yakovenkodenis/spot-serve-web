import { type RouteObject, redirect } from 'react-router';

import App from '../App';

export const ROUTES = {
  home: '/',
  app: '/app',
  about: '/about',
  support: '/support',
  notFound: '/not-found',
} as const;

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/home'),
      },
      {
        path: ROUTES.about,
        lazy: () => import('@/pages/about'),
      },
      {
        path: ROUTES.notFound,
        lazy: () => import('@/pages/not-found'),
      },
      {
        path: '*',
        loader: () => redirect(ROUTES.notFound),
      }
    ],
  },
] as const satisfies RouteObject[];
