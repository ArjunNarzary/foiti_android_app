import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: 0,
};

export const addNotificationSlice = createSlice({
    name: "CURRENTNOTIFICATIONS",
    initialState,
    reducers: {
        addNotifications: (state, action) => {
            state.notifications = action.payload.notification;
        },
    },
});

export const { addNotifications } = addNotificationSlice.actions;

export default addNotificationSlice.reducer;
