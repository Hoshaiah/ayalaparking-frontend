import { createSlice } from "@reduxjs/toolkit";

const viewSlice = createSlice({
  name: "view",
  initialState: {
    currentView: 'selectView',
    selectedNodes: [],
  },
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload
    },
    addToSelectedNodes: (state, action) => {
      state.selectedNodes = [
        ...state.selectedNodes,
        action.payload,
      ]
    },
    removeToSelectedNodes: (state, action) => {
        state.selectedNodes = state.selectedNodes.filter(item => item !== action.payload);
      },
  },
});

export const { setCurrentView, addToSelectedNodes, removeToSelectedNodes} = viewSlice.actions;
export default viewSlice.reducer;
