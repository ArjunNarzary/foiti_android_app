import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    granted: false,
    canAskAgain: true
};

export const pushNotificationPermissionSlice = createSlice({
    name: "PUSHNOTIFICATIONPERMISSION",
    initialState,
    reducers: {
        addPushNotiPermission: (state, action) => {
            state.granted = action.payload.granted;
            state.canAskAgain = action.payload.canAskAgain;
        },
        revertPushNoti: (state) => (state = initialState),
    },
});

export const { addPushNotiPermission, revertPushNoti } = pushNotificationPermissionSlice.actions;

export default pushNotificationPermissionSlice.reducer;
