import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    socialLoginRequest: (state) => {
      state.loading = true;
    },
    socialLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    socialLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { 
  registerRequest, 
  registerSuccess, 
  registerFail,
  socialLoginRequest,
  socialLoginSuccess,
  socialLoginFail,
  logout,
  clearError
} = authSlice.actions;

export const authReducer = authSlice.reducer;