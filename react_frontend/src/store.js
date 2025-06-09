import { configureStore } from '@reduxjs/toolkit';
import { productDetailsReducers, productsListReducers } from './reducers/productsReducers';
import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { userVerifyReducer } from './reducers/userReducers';

// Clear any potentially corrupted user data
localStorage.removeItem('userInfo');

// Get cart items from storage
const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

// Initial state with NO default user
const initialState = {
    userLogin: {
        userInfo: null,
        loading: false,
        error: null
    },
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
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

const store = configureStore({
    userVerify: userVerifyReducer,
    reducer: {
        productsList: productsListReducers,
        productDetails: productDetailsReducers,
        userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
        cart: cartReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes
store.subscribe(() => {
    const state = store.getState();
    
    // Only save userInfo if it's from a legitimate login/register
    if (state.userLogin.userInfo && state.userLogin.userInfo.token) {
        localStorage.setItem('userInfo', JSON.stringify(state.userLogin.userInfo));
    }
    
    if (state.cart.cartItems) {
        localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
    }
    
    if (state.cart.shippingAddress) {
        localStorage.setItem('shippingAddress', JSON.stringify(state.cart.shippingAddress));
    }
});

export default store;