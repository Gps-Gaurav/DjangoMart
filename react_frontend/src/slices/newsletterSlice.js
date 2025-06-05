import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for newsletter subscription
export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      '/api/newsletter/subscribe/',
      { 
        email,
        subscribed_at: new Date().toISOString()
      },
      config
    );
    return data;
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    loading: false,
    success: false,
    error: null
  },
  reducers: {
    clearNewsletterState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearNewsletterState } = newsletterSlice.actions;
export default newsletterSlice.reducer;