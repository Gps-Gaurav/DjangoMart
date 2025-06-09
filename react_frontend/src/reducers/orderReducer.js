import {
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
  } from '../constants/orderConstant';
  
  export const orderDetailsReducer = (state = { loading: true, order: {} }, action) => {
    switch (action.type) {
      case ORDER_DETAILS_REQUEST:
        return { ...state, loading: true };
      case ORDER_DETAILS_SUCCESS:
        return { loading: false, order: action.payload };
      case ORDER_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  