import { useDispatch, useSelector } from "react-redux";
import { calculateHourDifference, calculateParkingCost, dijkstra, findShortestPath, getDateTimeNow, getParkedCarNodes, turnNodesToParking, validateDateFormat } from "../../utils/graphUtils";
import {  setAdjacencyList, setNodeOccupancy, setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";
import { useState, useEffect } from "react";
import { setCarHistory } from "../../redux/historySlice";

const UnparkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)
    const history = useSelector(state => state.history)
    const [parkedCarsSelection, setParkedCarsSelection] = useState([])
    const [parkedCarInput, setParkedCarInput] = useState()
    const [dateTimeHelperText, setDateTimeHelperText] = useState('')
    const [dateInput, setDateInput]= useState(getDateTimeNow())
    const [receipt, setReceipt] = useState()
    const [disabledUnparkButton, setDisabledUnparkButton] = useState(parkedCarsSelection.length > 0)
    const [parkedCarHelperText, setParkedCarHelperText] = useState('')

    const handleUnparkCar = () => {
        const isDateValid = validateDateFormat(dateInput)
        if(!isDateValid) {
            setDateTimeHelperText('Date format is invalid')
            return;
        }
    
        const carPlate = graph.nodeOccupancy[parkedCarInput].carPlate
        const currentVehicleHistory = history.carHistory[carPlate]
        const lastParkHistory = currentVehicleHistory && currentVehicleHistory[currentVehicleHistory.length-1]
        const numberOfHoursParked = calculateHourDifference(lastParkHistory.entryTime, dateInput)

        if(numberOfHoursParked < 0) {
            setDateTimeHelperText(`Entry time ${lastParkHistory.entryTime} is later than exit time ${dateInput}. This is not possible.`)
            return;
        }
    
        
        const totalParkingCost = calculateParkingCost(numberOfHoursParked, graph.nodeOccupancy[parkedCarInput].parking)
        totalParkingCost['costPaidAlready'] = lastParkHistory.costPaidAlready || 0
        setReceipt(totalParkingCost)
        dispatch(setCarHistory({
            action: 'unpark',
            carPlate: carPlate,
            node: parkedCarInput,
            parkedCar: graph.nodeOccupancy[parkedCarInput].parkedCar,
            entryTime: lastParkHistory.entryTime,
            exitTime: dateInput,
            parkingSize: lastParkHistory.parkingSize,
            costPaidAlready: lastParkHistory.costPaidAlready,
            totalBill: totalParkingCost.total,
        }))
        dispatch(setNodeOccupancy({
            node: parkedCarInput,
            action: 'unparkCar',
        }))
        const updatedAdjacencyList = turnNodesToParking(graph.adjacencyList, [parkedCarInput], graph.nodeOccupancy)
        dispatch(setAdjacencyList(updatedAdjacencyList))
    }

    const handleDateInputChange = (e) => {
        setDateTimeHelperText('')
        const inputValue = e.target.value;
        const formattedDate = inputValue.replace('T', ' ');
        setDateInput(formattedDate);
    }

    useEffect(() => {
        const getParkedCarsNodesList= () => {
            const parkedCarNodes= getParkedCarNodes(graph.nodeOccupancy)
            setParkedCarsSelection(parkedCarNodes)
            setParkedCarInput(parkedCarNodes[0])
        }
        getParkedCarsNodesList()
    }, [graph.nodeOccupancy])

    useEffect(() => {
        const disableUnparkButton = () => {
           if(parkedCarsSelection.length === 0)  {
            setDisabledUnparkButton(true)
            setParkedCarHelperText('No cars are parked')
           } else {
            setDisabledUnparkButton(false)
            setParkedCarHelperText('')
           }
        }
        disableUnparkButton()
    },[parkedCarsSelection])

    return (
        <div className="h-full mx-1">
            <div className="flex flex-col w-full ml-2 mt-1 text-neutral-100 font-semibold text-md"> {'Unpark car details'}</div>
            <div className="flex flex-col w-full h-full items-center bg-neutral-200">
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Node to unpark</h1>
                    <select
                        value={parkedCarInput}
                        onChange={e => setParkedCarInput(e.target.value)}
                        className="border rounded h-10 px-2 w-20"
                    >
                        {parkedCarsSelection.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <p className="text-red-700 text-sm">{parkedCarHelperText}</p>
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Date and time of exit:</h1>
                    <p>{dateTimeHelperText}</p>
                    <input
                        className="h-10 px-2 w-56 border rounded"
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => handleDateInputChange(e)}
                        step="60" // Set step to 60 seconds (1 minute)
                    />
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <button className={`${disabledUnparkButton ? 'bg-gray-400':'bg-tree'} text-white font-semibold p-1 rounded-md w-60 h-12 my-2"`} onClick={handleUnparkCar} disabled={disabledUnparkButton}>Unpark</button>
                </div>

                {receipt && 
                    <div className="flex flex-col">
                        <h1>Bill Breakdown</h1>
                        <h1>{`Number of hours parked: ~ ${Math.ceil(receipt.totalHours)}hrs (${receipt.totalHours}hrs)`}</h1>
                        {receipt.flatHourTotal && <h1>{`First 3 hours: ${receipt.flatHourTotal}`}</h1>}
                        {receipt.fullDayCosts && <h1>{`Number of full days(${receipt.numberOfFullDays}) x 5000: ${receipt.fullDayCosts} `}</h1>}
                        {receipt.continuousTotal && <h1>{`${receipt.continuousHours}hr x ${receipt.parkingSize} parking: ${receipt.continuousTotal} `}</h1>}
                        {receipt.costPaidAlready > 0 && <h1>{`Cost paid from previous: -${receipt.costPaidAlready}`}</h1>}
                        {receipt.costPaidAlready? <h1>{`Total: Php ${receipt.total - receipt.costPaidAlready}`}</h1> :  <h1>{`Total: Php ${receipt.total}`}</h1> }
                    </div>
                }
            </div>
        </div>
    )
}

export default UnparkView;