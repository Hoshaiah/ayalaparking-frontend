import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice'

const store = configureStore({
  reducer: {
    graph: graphReducer
  },
});

export default store;