// src/redux/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    adjacencyList: {},
    distances: {},
    previous: {},
    shortestPath: [],
  },
  reducers: {
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

export const { setAdjacencyList, setDistances, setPrevious, setShortestPath} = graphSlice.actions;
export default graphSlice.reducer;
