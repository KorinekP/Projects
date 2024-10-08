import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import splendexLogo from './splendex-logo.svg';
import memorySlice from '../../Slice/MemorySlice';

const Header = () => {
  const dispatch = useDispatch();
  const [selectedNumCards, setSelectedNumCards] = useState(6); // Default value

  const handleStartNewGame = () => {
    dispatch(memorySlice.actions.setNumCards(selectedNumCards));
    dispatch(memorySlice.actions.startGame());
  };

  const handleDeckSizeChange = (e : any) => {
    setSelectedNumCards(Number(e.target.value));
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={splendexLogo} alt="Splendex Logo" className="header-left-logo" />
      </div>
      <div className="header-center">
        <div className="deck-size-selector">
          Deck Size
          <select className='decksizer' value={selectedNumCards} onChange={handleDeckSizeChange}>
            {[...Array(8)].map((_, index) => {
              const pairs = (index + 3) * 2;
              return (
                <option key={index} value={pairs}>
                  {pairs}
                </option>
              );
            })}
          </select>
        </div>
        <button onClick={handleStartNewGame} className="start-button">
          Start New Game
        </button>
      </div>
    </header>
  );
};

export default Header;
