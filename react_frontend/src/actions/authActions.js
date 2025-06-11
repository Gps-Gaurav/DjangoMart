import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// 🔹 GOOGLE AUTH ACTION
export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (tokenId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const { data } = await axios.post(
        '/api/auth/google/',
        { id_token: tokenId },
        config
      );

      return data; // this will be your userInfo object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

// 🔹 GITHUB AUTH ACTION
export const githubAuth = createAsyncThunk(
  'auth/githubAuth',
  async (code, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const { data } = await axios.post(
        '/api/auth/github/',
        { code },
        config
      );

      return data; // this will be your userInfo object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);
