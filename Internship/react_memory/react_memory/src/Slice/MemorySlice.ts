import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemoryState, Card } from './MemorySlice.types';

const initialState: MemoryState = {
  cards: [],
  flippedCard: -1,
  steps: 0,
  numCards: 6,
  gameStarted: false,
  gameEnded: false,
  coverUp: false,
  highScore:0,
};

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    startGame(state) {
      state.gameEnded = false;
      state.gameStarted = true;
      state.steps = 0;
      state.flippedCard = -1;
      state.cards = shuffle(generateCards(state.numCards));
      state.cards.forEach(card => {
        card.isMatched = false;
      });
    },
    flipCard(state, action: PayloadAction<number>) {
      if(state.coverUp) return;
      const cardId = action.payload;
      const cardIndex = state.cards.findIndex(card => card.id === cardId);
    
      if (state.cards[cardIndex].isMatched || state.cards[cardIndex].isFlipped) {
        return;
      }
    
      if (state.flippedCard === -1) {
        state.flippedCard = cardId;
        state.cards[cardIndex].isFlipped = true;
      } else {
        state.cards[cardIndex].isFlipped = true;
        state.coverUp = true;
      }
    },
    cover(state) {
        state.coverUp = false;
        const flippedCardIndex = state.cards.findIndex(card => card.id === state.flippedCard);
        const newlyFlippedCardIndex = state.cards.findIndex(card => card.isFlipped && !card.isMatched && card.id !== state.flippedCard);
        
        if (newlyFlippedCardIndex !== -1 && flippedCardIndex !== -1) {
          const firstCard = state.cards[flippedCardIndex];
          const secondCard = state.cards[newlyFlippedCardIndex];
          state.steps++;
          if (firstCard.image === secondCard.image) {
            state.cards[flippedCardIndex].isMatched = true;
            state.cards[newlyFlippedCardIndex].isMatched = true;
          } else {
            state.cards[flippedCardIndex].isFlipped = false;
            state.cards[newlyFlippedCardIndex].isFlipped = false;
          }
        }
        state.flippedCard = -1;
        if (state.cards.every(card => card.isMatched)) {
          state.gameEnded = true;
          if(state.highScore > state.steps || state.highScore == 0) state.highScore = state.steps;
        }
    },
    setNumCards(state, action: PayloadAction<number>) {
      state.numCards = action.payload;
    },
    resetHighScore(state) {
      state.highScore = 0;
    },
  },
});

const generateCards = (numCards: number): Card[] => {
  const cards: Card[] = [];

  for (let i = 0; i < numCards; i++) {
    const tempCard1: Card = {
      id: i,
      image: Math.floor(i/2),
      isFlipped: false,
      isMatched: false,
    };

    cards.push(tempCard1);
  }

  return cards;
};

const shuffle = (array: Card[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default memorySlice;
