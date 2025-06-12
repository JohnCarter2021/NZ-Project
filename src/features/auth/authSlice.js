import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // e.g., { name: 'Nirav Parmar', email: 'niravparmar@gmail.com' }
  token: null, // e.g., 'dummy-auth-token'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logOut(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selector to get current user
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;