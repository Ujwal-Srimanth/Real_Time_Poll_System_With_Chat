import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
});
