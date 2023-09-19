import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice'
import viewReducer from './viewSlice'

const store = configureStore({
  reducer: {
    graph: graphReducer,
    view: viewReducer
  },
});

export default store;