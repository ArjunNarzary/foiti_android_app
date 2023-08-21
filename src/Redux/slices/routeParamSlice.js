import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  coordinates: {},
  post: {},
}

export const routeParamSlice = createSlice({
  name: "ROUTEPARAMS",
  initialState,
  reducers: {
    addRouteParams: (state, action) => {
      state.coordinates = action.payload.coords
      state.post = action.payload.post
    },
    removeRouteParams: (state) => (state = initialState),
  },
})

export const { addRouteParams, removeRouteParams } = routeParamSlice.actions

export default routeParamSlice.reducer
