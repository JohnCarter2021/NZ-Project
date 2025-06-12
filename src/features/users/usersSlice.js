import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. UPDATED: URL now points to our Node.js backend's protected route
const USERS_URL = 'http://localhost:4000/api/users';

// 2. UPDATED: The thunk now accepts a second argument, thunkAPI, to access state
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      // Get the token from the auth slice in the Redux store
      const token = thunkAPI.getState().auth.token;

      // If there's no token, we can't make the request
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found.');
      }

      // Create the required headers for a protected endpoint
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Make the authenticated request
      const response = await axios.get(USERS_URL, config);
      return response.data;

    } catch (error) {
      // Handle errors, such as an expired token or server issue
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  users: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload; // Payload is the user data from our backend
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Payload is the rejection message
      });
  },
});

export default usersSlice.reducer;

// Selectors remain the same
export const selectAllUsers = (state) => state.users.users;