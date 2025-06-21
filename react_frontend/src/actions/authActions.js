import {
  GOOGLE_AUTH_REQUEST,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  GITHUB_AUTH_REQUEST,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAIL,
} from '../constants/authConstants';
import axios from 'axios';

// Base URL - make sure this matches your backend URL
const API_URL = 'djangomart-w4j9.onrender.com/api';

// Google Authentication
export const googleAuth = (credential) => async (dispatch) => {
  try {
    dispatch({ type: GOOGLE_AUTH_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      'https://djangomart-w4j9.onrender.com/api/auth/google/',
      { credential },
      config
    );

    // ✅ Build a clean, consistent user object
    const userInfo = {
      name: data.user.name || data.user.full_name || data.user.username || 'Guest',
      email: data.user.email,
      image: data.user.picture || null,
      token: data.tokens.access,
      isGoogle: true
    };

    // ✅ Save to localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);

    // ✅ Dispatch Redux actions
    dispatch({
      type: GOOGLE_AUTH_SUCCESS,
      payload: {
        user: userInfo,
        tokens: data.tokens
      }
    });

    dispatch({
      type: 'USER_LOGIN_SUCCESS',
      payload: userInfo
    });

    return data;

  } catch (error) {
    dispatch({
      type: GOOGLE_AUTH_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Google authentication failed'
    });
    throw error;
  }
};

// GitHub Authentication
export const githubAuth = (code) => async (dispatch) => {
  try {
      dispatch({ type: GITHUB_AUTH_REQUEST });

      const response = await fetch(`${API_URL}/auth/github/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'GitHub authentication failed');
      }

      // Store tokens
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);

      // Store user info in the same format as your existing userActions
      const userInfo = {
          email: data.user.email,
          name: data.user.name || data.user.login,
          token: data.tokens.access,
          isGithub: true
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      dispatch({
          type: GITHUB_AUTH_SUCCESS,
          payload: userInfo
      });

  } catch (error) {
      dispatch({
          type: GITHUB_AUTH_FAIL,
          payload: error.message
      });
  }
};

// Helper function to handle token refresh
export const refreshToken = async () => {
  try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token found');

      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'Token refresh failed');
      }

      localStorage.setItem('access_token', data.access);
      return data.access;

  } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userInfo');
      throw error;
  }
};

// Export default object with all actions
const authActions = { googleAuth, githubAuth, refreshToken };
export default authActions;