import { configureStore } from '@reduxjs/toolkit';
import { productDetailsReducers, productsListReducers } from './reducers/productsReducers';

const store = configureStore({
  reducer: {
    productsList: productsListReducers,
    productDetails: productDetailsReducers
  },
  preloadedState: {}, // This replaces initialState
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production', // This replaces Redux DevTools setup
});

export default store;