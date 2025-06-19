import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/polls';

export const createPoll = createAsyncThunk('poll/create', async (payload) => {
  console.log(payload)
  const response = await axios.post('http://localhost:5000/api/polls/create', payload);
  return response.data;
});
const pollSlice = createSlice({
  name: 'poll',
  initialState: {
    poll: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.poll = action.payload;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default pollSlice.reducer;
