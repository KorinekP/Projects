import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './components/LandingPage';
import Game from './components/Game';
import { MemoryState } from './Slice/MemorySlice.types';

const App = () => {
  const { gameStarted } = useSelector((state: { memory: MemoryState }) => state.memory);

  const router = createBrowserRouter([
    { path: '/', element: gameStarted ? <Game /> : <LandingPage /> },
    { path: '/game', element: <Game /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
