import {
  GOOGLE_AUTH_REQUEST,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  GITHUB_AUTH_REQUEST,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAIL,
} from '../constants/authConstants';

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case GOOGLE_AUTH_REQUEST:
      return { loading: true };
    case GOOGLE_AUTH_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload.user,
        tokens: action.payload.tokens
      };
    case GOOGLE_AUTH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
      case GITHUB_AUTH_FAIL:
          return {
              loading: false,
              error: action.payload
          };

      default:
          return state;
  }
};