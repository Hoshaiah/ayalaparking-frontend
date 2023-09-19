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
    nodeOccupancy: {}
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
    setNodeOccupancy: (state, action) => {
        const updatedNodeOccupancy = {
          ...state.nodeOccupancy,
        }
        if(action.payload.action === 'remove') {
            action.payload.nodes.forEach(node => {
                updatedNodeOccupancy[node] = 'occupied'
            });
        } else if(action.payload.action === 'reset') {
            action.payload.nodes.forEach(node => {
                delete updatedNodeOccupancy[node]
            })
        }
        state.nodeOccupancy = updatedNodeOccupancy
    },
  },
});

export const { setOriginalAdjacencyList, setAdjacencyList, setDistances, setPrevious, setShortestPath, setNodeOccupancy} = graphSlice.actions;
export default graphSlice.reducer;
