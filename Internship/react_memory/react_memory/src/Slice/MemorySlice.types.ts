// src/store/types.ts
export interface MemoryState {
    cards: Card[];
    flippedCard: number;
    steps: number;
    numCards: number;
    gameStarted: boolean;
    gameEnded: boolean;
    coverUp : boolean;
    highScore : number;
  }
  
  export interface Card {
    id: number;
    image: number;
    isFlipped: boolean;
    isMatched: boolean;
  }
  
  export interface SetNumPairsAction {
    type: 'memory/setNumPairs';
    payload: number;
  }
  
  export interface StartGameAction {
    type: 'memory/startGame';
  }
  
  // Define other action types as needed
  export type MemoryAction = SetNumPairsAction | StartGameAction;
  