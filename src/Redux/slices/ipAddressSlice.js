import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ip: "",
};

export const ipAddressSlice = createSlice({
  name: "IPADDRESS",
  initialState,
  reducers: {
    addIp: (state, action) => {
      state.ip = action.payload.ip;
    },
    removeIp: (state) => (state = initialState),
  },
});

export const { addIp, removeIp } = ipAddressSlice.actions;

export default ipAddressSlice.reducer;
