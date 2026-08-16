import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const token = localStorage.getItem("token");
let user = null;

try {
  user = savedUser ? JSON.parse(savedUser) : null;
} catch {
  localStorage.removeItem("user");
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    token: token || null,
    isLoggedIn: Boolean(token),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;