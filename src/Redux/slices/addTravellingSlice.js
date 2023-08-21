import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    administrative_area_level_1: "",
    country: "",
    short_country: "",
    coordinates: {},
};

export const addTravellingSlice = createSlice({
    name: "ADD_TRAVELLING",
    initialState,
    reducers: {
        addTravelFrom: (state, action) => {
            state.name = action.payload.name;
            state.administrative_area_level_1 =
                action.payload.administrative_area_level_1;
            state.country = action.payload.country;
            state.short_country = action.payload.short_country;
            state.coordinates = action.payload.coordinates;
        },
        removeTravelFrom: (state) => (state = initialState),
    },
});

export const { addTravelFrom, removeTravelFrom } = addTravellingSlice.actions;

export default addTravellingSlice.reducer;
