import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    carHistory: {},
  },
  reducers: {
    setCarHistory: (state, action) => {
        if (!state.carHistory[action.payload.node]){
            state.carHistory = {
                ...state.carHistory,
                [action.payload.node]: [{
                    action: action.payload.action,
                    node: action.payload.node,
                    parkedCar: action.payload.parkedCar,
                    parkingSize: action.payload.parkingSize,
                    entryTime: action.payload.entryTime,
                    carPlate: action.payload.carPlate
                }]
            }            
        } else {
            state.carHistory = {
                ...state.carHistory,
                [action.payload.node]: [
                    ...state.carHistory[action.payload.node],
                    {
                    action: action.payload.action,
                    node: action.payload.node,
                    parkedCar: action.payload.parkedCar,
                    parkingSize: action.payload.parkingSize,
                    entryTime: action.payload.entryTime,
                    carPlate: action.payload.carPlate
                }]
            }            

        }
    },
  },
});

export const { setCarHistory } = historySlice.actions;
export default historySlice.reducer;
