import { type RouteObject, redirect } from 'react-router';

import { App } from '../App';
import { ROUTES } from '@/constants/routes';

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
        path: ROUTES.support,
        lazy: () => import('@/pages/support'),
      },
      {
        path: ROUTES.app,
        lazy: () => import('@/pages/app'),
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
