import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    carHistory: {},
  },
  reducers: {
    setCarHistory: (state, action) => {
        if (!state.carHistory[action.payload.carPlate]){
            state.carHistory = {
                ...state.carHistory,
                [action.payload.carPlate]: [{
                    action: action.payload.action,
                    node: action.payload.node,
                    parkedCar: action.payload.parkedCar,
                    parkingSize: action.payload.parkingSize,
                    entryTime: action.payload.entryTime,
                    exitTime: action.payload.exitTime,
                    totalBill: action.payload.totalBill
                }]
            }            
        } else {
            state.carHistory = {
                ...state.carHistory,
                [action.payload.carPlate]: [
                    ...state.carHistory[action.payload.carPlate],
                    {
                    action: action.payload.action,
                    node: action.payload.node,
                    parkedCar: action.payload.parkedCar,
                    parkingSize: action.payload.parkingSize,
                    entryTime: action.payload.entryTime,
                    exitTime: action.payload.exitTime,
                    totalBill: action.payload.totalBill
                }]
            }            

        }
    },
  },
});

export const { setCarHistory } = historySlice.actions;
export default historySlice.reducer;
