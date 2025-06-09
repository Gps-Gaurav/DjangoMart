import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_REQUEST,
  USER_VERIFY_SUCCESS,
  USER_VERIFY_FAIL,
  USER_VERIFY_RESET,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
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

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { 
                loading: false, 
                success: true,
                userInfo: action.payload 
            };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
// ... existing reducers

export const userVerifyReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case USER_VERIFY_REQUEST:
            return { loading: true };
        case USER_VERIFY_SUCCESS:
            return { loading: false, success: true };
        case USER_VERIFY_FAIL:
            return { loading: false, error: action.payload };
        case USER_VERIFY_RESET:
            return { loading: false };
        default:
            return state;
    }
};

export const userProfileReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_PROFILE_REQUEST:
        return { ...state, loading: true };
  
      case USER_PROFILE_SUCCESS:
        return { loading: false, user: action.payload, error: null };
  
      case USER_PROFILE_FAIL:
        return { loading: false, user: null, error: action.payload };
  
      default:
        return state;
    }
  };