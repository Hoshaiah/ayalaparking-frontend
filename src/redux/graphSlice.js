// src/redux/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    originalAdjacencyList: {},
    adjacencyList: {},
    distances: {},
    previous: {},
    shortestPath: [],
  },
  reducers: {
    setOriginalAdjacencyList: (state, action) => {
      state.originalAdjacencyList = action.payload
    },
    setAdjacencyList: (state, action) => {
      state.adjacencyList = action.payload
    },
    setDistances: (state, action) => {
      state.distances = action.payload
    },
    setPrevious: (state, action) => {
      state.previous = action.payload
    },
    setShortestPath: (state, action) => {
      state.shortestPath = action.payload
    },
  },
});

export const { setOriginalAdjacencyList, setAdjacencyList, setDistances, setPrevious, setShortestPath} = graphSlice.actions;
export default graphSlice.reducer;
