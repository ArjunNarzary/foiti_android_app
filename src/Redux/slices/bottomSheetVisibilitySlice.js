import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "",
    visible: false,
};

export const bottomSheetVisibilitySlice = createSlice({
    name: "BOTTOMSHEETVISIBILITY",
    initialState,
    reducers: {
        setBSVisibility: (state, action) => {
            state.type = action.payload.type;
            state.visible = action.payload.visible;
        },
        clearBSVisibility: (state) => (state = initialState),
    },
});

export const { setBSVisibility, clearBSVisibility } = bottomSheetVisibilitySlice.actions;
export default bottomSheetVisibilitySlice.reducer;
