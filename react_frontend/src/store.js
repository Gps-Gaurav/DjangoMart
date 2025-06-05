import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { productDetailsReducers, productsListReducers } from './reducers/productsReducers';

const reducer = combineReducers({
    productsList: productsListReducers,
    productDetails: productDetailsReducers
});

const initialState = {};
const middleware = [thunk];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(...middleware))
);

export default store;
