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

// Thunk to delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // The backend is expected to return a success message, e.g., { message: 'User deleted successfully.' }
      // And the userId is passed as an argument to the thunk, accessible via action.meta.arg in reducer
      await axios.delete(`${USERS_URL}/${userId}`, config);
      return userId; // Return the userId to use in the reducer for removing the user
    } catch (error) {
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

// Thunk to update an existing user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }, thunkAPI) => { // Destructure id and the rest of userData
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // The backend is expected to return { message: '...', user: { ... } }
      const response = await axios.put(`${USERS_URL}/${id}`, userData, config);
      return response.data; // This should contain the updated user object
    } catch (error) {
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

// Thunk to create a new user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // The backend is expected to return { message: '...', user: { ... } }
      const response = await axios.post(USERS_URL, userData, config);
      return response.data; // This should contain the new user object and a message
    } catch (error) {
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
      })
      // Reducers for createUser
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming backend returns { message: '...', user: newUser }
        // And that newUser is the user object to be added to the store
        if (action.payload.user) {
          state.users.push(action.payload.user);
        } else {
          // Handle cases where user might not be in payload as expected
          // This could be an indication of an issue with backend response or thunk logic
          console.warn('createUser.fulfilled: No user object in payload', action.payload);
          // Potentially set error state here or rely on backend to send appropriate error
        }
        // Optionally reset error state if previous operations failed
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Reducers for updateUser
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming backend returns { message: '...', user: updatedUser }
        if (action.payload.user) {
          const updatedUser = action.payload.user;
          const index = state.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        } else {
          console.warn('updateUser.fulfilled: No user object in payload', action.payload);
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Reducers for deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.payload is the userId returned from the thunk
        const userIdToDelete = action.payload;
        state.users = state.users.filter(user => user.id !== userIdToDelete);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;

// Selectors remain the same
export const selectAllUsers = (state) => state.users.users;