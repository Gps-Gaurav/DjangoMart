import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL
} from '../constants/userConstants';

const initialState = {
  userInfo: null,
  loading: false,
  error: null
};

export const userLoginReducer = (state = initialState, action) => {
  switch (action.type) {
      case USER_LOGIN_REQUEST:
          return { ...initialState, loading: true };

      case USER_LOGIN_SUCCESS:
          return {
              loading: false,
              userInfo: action.payload,
              error: null
          };

      case USER_LOGIN_FAIL:
          return {
              loading: false,
              userInfo: null,
              error: action.payload
          };

      case USER_LOGOUT:
          return initialState;

      default:
          return state;
  }
};

export const userRegisterReducer = (state = initialState, action) => {
  switch (action.type) {
      case USER_REGISTER_REQUEST:
          return { ...initialState, loading: true };

      case USER_REGISTER_SUCCESS:
          return {
              loading: false,
              userInfo: action.payload,
              error: null
          };

      case USER_REGISTER_FAIL:
          return {
              loading: false,
              userInfo: null,
              error: action.payload
          };

      case USER_LOGOUT:
          return initialState;

      default:
          return state;
  }
};