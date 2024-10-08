import { configureStore } from '@reduxjs/toolkit';
import MemorySlice from '../Slice/MemorySlice';

const store = configureStore({
  reducer: {
    memory: MemorySlice.reducer,
  },
});

export default store;