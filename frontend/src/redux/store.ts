import { configureStore } from '@reduxjs/toolkit';
import StockReducer from '../redux/stocksSlice';

export const store = configureStore({
  reducer: {
    stocks: StockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

