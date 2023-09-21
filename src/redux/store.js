import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice'
import viewReducer from './viewSlice'
import historyReducer from './historySlice'

const store = configureStore({
  reducer: {
    graph: graphReducer,
    view: viewReducer,
    history: historyReducer
  },
});

export default store;