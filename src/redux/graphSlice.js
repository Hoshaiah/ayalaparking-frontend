// src/redux/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    adjacencyList: {},
  },
  reducers: {
    setAdjacencyList: (state, action) => {
      state.adjacencyList = action.payload
    },
  },
});

export const { setAdjacencyList } = graphSlice.actions;
export default graphSlice.reducer;
