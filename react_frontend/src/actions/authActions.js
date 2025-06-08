import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const register = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const { data } = await axios.post(
        '/api/users/register/',
        {
          'first_name': firstName,
          'last_name': lastName,
          'email': email,
          'password': password
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

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
        '/api/users/google/',
        { token_id: tokenId },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

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
        '/api/users/github/',
        { code },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);