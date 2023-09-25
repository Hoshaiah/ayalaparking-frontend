import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const viewSlice = createSlice({
  name: "view",
  initialState: {
    currentView: 'editView',
    selectedNodes: [],
    notifications: {},
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
    removeAllSelectedNodes: (state, action) => {
        state.selectedNodes = []
    },
    addNotification: (state, action) => {
        state.notifications = {
          ...state.notifications,
            [v4()]: action.payload
        }
    },
    removeNotification: (state, action) => {
      delete state.notifications[action.payload]
    }
  },
});

export const { setCurrentView, addToSelectedNodes, removeToSelectedNodes, removeAllSelectedNodes, addNotification, removeNotification} = viewSlice.actions;
export default viewSlice.reducer;
