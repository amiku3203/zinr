 import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
        console.log("Setting token:", action.payload);
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
        console.log("Setting user:", action.payload);
      state.user = action.payload;
    },
  },
});

export const { setToken, clearAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
