import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  userId: null,
};

const loginSlice = createSlice({
  name: "logSlice",
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload && action.payload.id) {
        state.isLogged = true;
        state.userId = action.payload.id;
      }
    },
    logout: (state) => {
      state.isLogged = false;
      state.userId = null;
    },
  },
});

export default loginSlice.reducer;
export const { login, logout } = loginSlice.actions;
