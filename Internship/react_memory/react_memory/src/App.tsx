import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter, RouteObject } from 'react-router-dom';
import LandingPage from './components/Landing/Landing';
import Game from './components/Game/Game';
import store from './store/store';

const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/game', element: <Game /> },
];

const router = createBrowserRouter(routes);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

export default App;
