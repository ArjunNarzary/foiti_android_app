import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
};

export const addNavigationSlice = createSlice({
  name: "ADD_NAVIGATION",
  initialState,
  reducers: {
    addNavigation: (state, action) => {
      state.name = action.payload.name;
    },
    removeNavigation: (state) => (state = initialState),
  },
});

export const { addNavigation, removeNavigation } = addNavigationSlice.actions;

export default addNavigationSlice.reducer;
