import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    carHistory: JSON.parse(localStorage.getItem('carHistory')) || {},
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
                    costPaidAlready: action.payload.costPaidAlready,
                    exitTime: action.payload.exitTime,
                    totalBill: action.payload.totalBill,
                    continuationFromLastParking: action.payload.continuationFromLastParking,
                    recentEntryTime: action.payload.recentEntryTime
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
                    costPaidAlready: action.payload.costPaidAlready,
                    exitTime: action.payload.exitTime,
                    totalBill: action.payload.totalBill,
                    continuationFromLastParking: action.payload.continuationFromLastParking,
                    recentEntryTime: action.payload.recentEntryTime
                }]
            }            

        }
    },
  },
});

export const { setCarHistory } = historySlice.actions;
export default historySlice.reducer;
