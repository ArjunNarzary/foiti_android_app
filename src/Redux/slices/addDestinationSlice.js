import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    place_id: "",
    name: "",
    administrative_area_level_1: "",
    country: "",
    short_country: "",
    coordinates: {},
    types: "",
    address: ""
};

export const addDestinationSlice = createSlice({
    name: "ADD_DESTINATION",
    initialState,
    reducers: {
        addDestination: (state, action) => {
            state.place_id = action.payload.place_id;
            state.name = action.payload.name;
            state.administrative_area_level_1 =
                action.payload.administrative_area_level_1;
            state.country = action.payload.country;
            state.short_country = action.payload.short_country;
            state.coordinates = action.payload.coordinates;
            state.types = action.payload.types;
            state.address = action.payload.address;
        },
        removeDestination: (state) => (state = initialState),
    },
});

export const { addDestination, removeDestination } = addDestinationSlice.actions;

export default addDestinationSlice.reducer;
