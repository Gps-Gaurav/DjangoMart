import { configureStore } from '@reduxjs/toolkit';
import { productDetailsReducers, productsListReducers } from './reducers/productsReducers';
import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';

// Get stored data from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : {
      name: 'Gps-Gaurav',
      lastLogin: '2025-06-08 17:39:41',
      isAdmin: false,
    };

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// Preloaded state with stored data
const preloadedState = {
  userLogin: { 
    userInfo: userInfoFromStorage,
    loading: false,
    error: null
  },
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage
  },
  // Initialize other states as needed
  productsList: {
    products: [],
    loading: false,
    error: null
  },
  productDetails: {
    product: null,
    loading: false,
    error: null
  }
};

// Configure store with all reducers and middleware
const store = configureStore({
  reducer: {
    productsList: productsListReducers,
    productDetails: productDetailsReducers,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    cart: cartReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['FLUSH', 'REHYDRATE', 'PAUSE', 'PERSIST', 'PURGE', 'REGISTER'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes to save certain states to localStorage
store.subscribe(() => {
  const state = store.getState();
  
  // Save cart items
  localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
  
  // Save user info
  localStorage.setItem('userInfo', JSON.stringify(state.userLogin.userInfo));
  
  // Save shipping address
  if (state.cart.shippingAddress) {
    localStorage.setItem('shippingAddress', 
      JSON.stringify(state.cart.shippingAddress)
    );
  }
});

export default store;