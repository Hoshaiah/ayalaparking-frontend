import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
  name: "view",
  initialState: {
    currentView: '',
  },
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload
    },
  },
});

export const { setCurrentView } = viewSlice.actions;
export default viewSlice.reducer;
