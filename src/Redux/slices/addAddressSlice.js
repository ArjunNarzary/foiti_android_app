import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  administrative_area_level_1: "",
  country: "",
  short_country: "",
  coordinates: {},
};

export const addAddressSlice = createSlice({
  name: "ADD_ADDRESS",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.name = action.payload.name;
      state.administrative_area_level_1 =
        action.payload.administrative_area_level_1;
      state.country = action.payload.country;
      state.short_country = action.payload.short_country;
      state.coordinates = action.payload.coordinates;
    },
    removeAddress: (state) => (state = initialState),
  },
});

export const { addAddress, removeAddress } = addAddressSlice.actions;

export default addAddressSlice.reducer;
