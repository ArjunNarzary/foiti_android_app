import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  message: "",
};

export const alertSlice = createSlice({
  name: "REDUXALERT",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    clearAlert: (state) => (state = initialState),
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
