import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coords: {},
};

export const locationSlice = createSlice({
  name: "LOCATIONCOORDS",
  initialState,
  reducers: {
    addCoords: (state, action) => {
      state.coords = action.payload.coords;
    },
    removeCoords: (state) => (state = initialState),
  },
});

export const { addCoords, removeCoords } = locationSlice.actions;

export default locationSlice.reducer;
