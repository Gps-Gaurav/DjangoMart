import axios from 'axios';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from '../constants/userConstants';

// Login action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Get tokens from login endpoint
    const { data } = await axios.post(
      '/api/users/login/',
      { email, password },
      config
    );

    // Get user profile with access token
    const { access, refresh } = data;
    const userConfig = {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    };

    const { data: userData } = await axios.get('/api/users/profile/', userConfig);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: {
        ...userData,
        token: access,
        refreshToken: refresh
      }
    });

    localStorage.setItem('userInfo', JSON.stringify({
      ...userData,
      token: access,
      refreshToken: refresh
    }));

  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    });
  }
};

// Register action
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      '/api/users/register/',
      { name, email, password },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    });

    // Automatically log in after successful registration
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('userInfo', JSON.stringify(data));

  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    });
  }
};

// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};

// Refresh token action
export const refreshToken = () => async (dispatch, getState) => {
  try {
    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      '/api/users/login/refresh/',
      { refresh: userInfo.refreshToken },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: {
        ...userInfo,
        token: data.access,
        refreshToken: data.refresh
      }
    });

    localStorage.setItem('userInfo', JSON.stringify({
      ...userInfo,
      token: data.access,
      refreshToken: data.refresh
    }));

  } catch (error) {
    dispatch(logout());
  }
};