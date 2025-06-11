import { createSlice } from '@reduxjs/toolkit';
import { register, googleAuth, githubAuth } from '../actions/userActions';

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
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('userInfo');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Google Auth
    builder.addCase(googleAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    });
    builder.addCase(googleAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // GitHub Auth
    builder.addCase(githubAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(githubAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    });
    builder.addCase(githubAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
