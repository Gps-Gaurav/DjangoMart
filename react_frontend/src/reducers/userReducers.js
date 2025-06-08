import { createSlice } from '@reduxjs/toolkit';

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    userLoginRequest: (state) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
});

const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    userRegisterRequest: (state) => {
      state.loading = true;
    },
    userRegisterSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
    },
    userRegisterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  userLoginRequest, 
  userLoginSuccess, 
  userLoginFail, 
  userLogout 
} = userLoginSlice.actions;

export const { 
  userRegisterRequest, 
  userRegisterSuccess, 
  userRegisterFail 
} = userRegisterSlice.actions;

export const userLoginReducer = userLoginSlice.reducer;
export const userRegisterReducer = userRegisterSlice.reducer;