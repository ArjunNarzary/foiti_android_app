import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import addAddressReducer from "./slices/addAddressSlice";
import addDestinationReducer from "./slices/addDestinationSlice";
import addTravellingReducer from "./slices/addTravellingSlice";
import AddPlaceReducer from "./slices/addPlaceSlice";
import authReducer from "./slices/authSlice";
import ipAddressReducer from "./slices/ipAddressSlice";
import locationReducer from "./slices/locationSlice";
import addNavigationReducer from "./slices/addNavigationSlice";
import addNotificationReducer from "./slices/addNotificationSlice";
import editPostReducer from "./slices/editPostSlice";
import alertReducer from "./slices/alertSlice";
import bottomSheetVisibilityReducer from './slices/bottomSheetVisibilitySlice'
import routeParamReducer from './slices/routeParamSlice'
import pushNotificationPermissionReducer from './slices/pushNotificationPermissionSlice'

//APIS
import { serviceApi } from "./services/serviceApi";

const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    NEWPLACE: AddPlaceReducer,
    ADD_ADDRESS: addAddressReducer,
    ADD_DESTINATION: addDestinationReducer,
    ADD_TRAVELLING: addTravellingReducer,
    EDITPOST: editPostReducer,
    AUTHUSER: authReducer,
    LOCATIONCOORD: locationReducer,
    IPADDRESS: ipAddressReducer,
    ADD_NAVIGATION: addNavigationReducer,
    CURRENTNOTIFICATIONS: addNotificationReducer,
    REDUXALERT: alertReducer,
    BOTTOMSHEETVISIBILITY: bottomSheetVisibilityReducer,
    ROUTEPARAMS: routeParamReducer,
    PUSHNOTIPERMISSION: pushNotificationPermissionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      serviceApi.middleware
    ),
})

setupListeners(store.dispatch);

export default store;
