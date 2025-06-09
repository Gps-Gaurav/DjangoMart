import {
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
  } from '../constants/orderConstant';
  
  export const getOrderDetails = (orderId) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_DETAILS_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const response = await fetch(`/api/orders/${orderId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.access}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch order details');
      }
  
      const data = await response.json();
  
      dispatch({
        type: ORDER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ORDER_DETAILS_FAIL,
        payload: error.message || 'Something went wrong',
      });
    }
  };
  