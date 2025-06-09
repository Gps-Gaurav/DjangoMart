import { createReducer } from '@reduxjs/toolkit';
import { APP_CONSTANTS } from '../constants/appConstant';

const { CURRENT_TIME, DEFAULT_USER } = APP_CONSTANTS;

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    timestamp: CURRENT_TIME,
    current_user: DEFAULT_USER
};

export const productsListReducers = createReducer(initialState, (builder) => {
    builder
        .addCase('PRODUCT_LIST_REQUEST', (state) => {
            state.loading = true;
            state.timestamp = CURRENT_TIME;
            state.current_user = DEFAULT_USER;
        })
        .addCase('PRODUCT_LIST_SUCCESS', (state, action) => {
            state.loading = false;
            state.products = action.payload.products || [];
            state.timestamp = CURRENT_TIME;
            state.current_user = DEFAULT_USER;
        })
        .addCase('PRODUCT_LIST_FAIL', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.timestamp = CURRENT_TIME;
            state.current_user = DEFAULT_USER;
        });
});

export const productDetailsReducers = createReducer(initialState, (builder) => {
    builder
      .addCase('PRODUCT_DETAILS_REQUEST', (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase('PRODUCT_DETAILS_SUCCESS', (state, action) => {
        state.loading = false;
        state.product = action.payload.product; // <-- extract product from payload
        state.error = null;
      })
      .addCase('PRODUCT_DETAILS_FAIL', (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.product = null;
      });
  });