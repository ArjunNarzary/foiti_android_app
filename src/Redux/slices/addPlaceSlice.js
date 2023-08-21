import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  place_id: "",
  images: [],
  fullAddress: "",
  types: [],
  place_id: "",
  address: {},
  coordinates: {},
  created_place: false,
  timing: "",
  phone_number: "",
};

export const addPlaceSlice = createSlice({
  name: "NEWPLACE",
  initialState,
  reducers: {
    addPlaceData: (state, action) => {
      state.name = action.payload.name;
      state.place_id = action.payload.place_id;
      state.fullAddress = action.payload.fullAddress;
      state.types = action.payload.types;
      state.address = action.payload.address;
      state.coordinates = action.payload.coordinates;
      state.created_place = action.payload.created_place || false;
      state.timing = action.payload.timing;
      state.phone_number = action.payload.phone_number || "";
    },
    addImages: (state, action) => {
      state.images = action.payload.images;
      state.name = "";
      state.place_id = "";
      state.fullAddress = "";
      state.types = [];
      state.address = {};
      state.coordinates = {};
      state.created_place = false;
      state.timing = "";
      state.phone_number = "";
    },
    addCreatedPlaceStatus: (state, action) => {
      state.created_place = action.payload.created_place;
    },
    removeCreatedPlaceStatus: (state, action) => {
      state.created_place = initialState.created_place;
    },
    updatePlaceData: (state, action) => {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    },
    removePlaceData: (state) => (state = initialState),
  },
});

export const { addPlaceData, removePlaceData, updatePlaceData, addImages } =
  addPlaceSlice.actions;

export default addPlaceSlice.reducer;
