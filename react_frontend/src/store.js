import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { productDetailsReducers, productsListReducers } from './reducers/productsReducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    productsList: productsListReducers,
    productDetails: productDetailsReducers
});

const initialState = {};
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;