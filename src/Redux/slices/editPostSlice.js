import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  edit: false,
  captionText: "",
  postId: "",
};

export const editPostSlice = createSlice({
  name: "EDITPOST",
  initialState,
  reducers: {
    addPostDetails: (state, action) => {
      state.edit = action.payload.edit;
      state.captionText = action.payload.captionText;
      state.postId = action.payload.postId;
    },
    removePostDetails: (state) => (state = initialState),
  },
});

export const { addPostDetails, removePostDetails } = editPostSlice.actions;

export default editPostSlice.reducer;
