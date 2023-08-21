import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  token: "",
};

export const authSlice = createSlice({
  name: "AUTHUSER",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    removeUser: (state) => (state = initialState),
  },
});

export const { addUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
