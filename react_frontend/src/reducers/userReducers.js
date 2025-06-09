import { createSlice } from "@reduxjs/toolkit";
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/userConstants";

const userLoginSlice = createSlice({
  name: "userLogin",
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

export const { userLoginRequest, userLoginSuccess, userLoginFail, userLogout } =
  userLoginSlice.actions;

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };

    case USER_REGISTER_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };

    case USER_REGISTER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export const userLoginReducer = userLoginSlice.reducer;
