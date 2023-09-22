import { useDispatch, useSelector } from "react-redux";
import { blockNodes, calculateHourDifference, determineWhichParkingToUse, dijkstra, findNearestParking, findShortestPath, getDateTimeNow, getEntranceNodes, validateDateFormat } from "../../utils/graphUtils";
import {  setAdjacencyList, setDistances, setNodeOccupancy, setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";
import { useEffect, useRef, useState } from "react";
import { setCarHistory } from "../../redux/historySlice";

const ParkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)
    const history = useSelector(state => state.history)
    const [plateNumberInput, setPlateNumberInput]= useState('')
    const [plateNumberHelperText, setPlateNumberHelperText] = useState('')
    const [dateTimeHelperText, setDateTimeHelperText] = useState('')
    const [dateInput, setDateInput]= useState(getDateTimeNow())
    const [entranceSelection, setEntranceSelection] = useState([])
    const [entranceInput, setEntranceInput] = useState(getEntranceNodes(graph.nodeOccupancy)[0])
    const [prioritizeCostInput, setPriorityCostInput]= useState(false) 
    const [vehicleSize, setVehicleSize]= useState('small')
    const [parkButtonDisabled, setParkButtonDisabled] = useState(true)

    const handleDateInputChange = (e) => {
        setDateTimeHelperText('')
        const inputValue = e.target.value;
        const formattedDate = inputValue.replace('T', ' ');
        setDateInput(formattedDate);
    }

    const handleCalculateShortestPaths = () => {
        const data = dijkstra(graph.adjacencyList, entranceInput)
        dispatch(setDistances(data.distances))
        dispatch(setDistances(data.previous))
        const nearestParking = findNearestParking(data.distances,graph.nodeOccupancy, vehicleSize, prioritizeCostInput)[0]

        if(nearestParking) {
            const shortestPath = findShortestPath(data.distances, data.previous, entranceInput, nearestParking.node)
            dispatch(setShortestPath(shortestPath)) 
        }
    }

    const handleParkVehicle = () => {
        const isPlateNumberEmpty = plateNumberInput.trim().length === 0
        if(isPlateNumberEmpty){
            setPlateNumberHelperText('this is a required field')
            return;
        }

        const isDateValid = validateDateFormat(dateInput)
        if(!isDateValid) {
            setDateTimeHelperText('Date format is invalid')
            return;
        }

        const currentVehicleHistory = history.carHistory[plateNumberInput]
        if (currentVehicleHistory && currentVehicleHistory[currentVehicleHistory.length-1].action === 'park') {
            setPlateNumberHelperText('This car is already parked!')
            return;
        }

        const nodeDestination = graph.shortestPath[graph.shortestPath.length-1]
        let entryTime = dateInput
        let costPaidAlready = 0
        let parkingSize = graph.nodeOccupancy[nodeDestination].parking

        // Check if car exited parking less than an hour ago
        const lastUnparkHistory = currentVehicleHistory && currentVehicleHistory[currentVehicleHistory.length-1]
        if (lastUnparkHistory && lastUnparkHistory.action === 'unpark') {
            const hoursSinceLastExit = calculateHourDifference(currentVehicleHistory[currentVehicleHistory.length-1].exitTime, dateInput)
            if(hoursSinceLastExit < 1) {
                entryTime = lastUnparkHistory.entryTime
                costPaidAlready = lastUnparkHistory.totalBill
                parkingSize = determineWhichParkingToUse(graph.nodeOccupancy[nodeDestination].parking, lastUnparkHistory.parkingSize)
            }

        }


       dispatch(setCarHistory({
           action: 'park',
           carPlate: plateNumberInput,
           node: nodeDestination,
           parkedCar: vehicleSize,
           parkingSize: parkingSize,
           entryTime: entryTime,
           costPaidAlready: costPaidAlready,
       }))
        dispatch(setNodeOccupancy({
            action: 'parkCar',
            node:  nodeDestination,
            parkedCar: vehicleSize,
            entryTime: entryTime,
            carPlate: plateNumberInput
        }))
        const updatedAdjacencyList = blockNodes(graph.adjacencyList, [nodeDestination], graph.nodeOccupancy)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(setShortestPath([])) 
    }

    useEffect(()=> {
        const changeParkButtonAvailability = () => {
            if(graph.shortestPath.length > 0) {
                setParkButtonDisabled(false)
            } else {
                setParkButtonDisabled(true)
            }
        }
        changeParkButtonAvailability()
    },[graph.shortestPath, plateNumberInput])

    useEffect(() => {
        const getEntranceNodesList = () => {
            const entranceNodes = getEntranceNodes(graph.nodeOccupancy)
            setEntranceSelection(entranceNodes)
        }
        getEntranceNodesList()
    }, [graph.nodeOccupancy])

    useEffect(() => {
        const refreshShortestPathOnInputChange = () => {
           dispatch(setShortestPath([])) 
        }
        refreshShortestPathOnInputChange()
    },[entranceInput, vehicleSize, prioritizeCostInput])
    
    return (
        <div className="h-full mx-1">
            <div className="flex flex-col w-full ml-2 mt-1 text-neutral-100 font-semibold text-md"> {'Park car details'}</div>
            <div className="flex flex-col w-full h-full items-center bg-neutral-200">
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Vehicle Plate</h1>
                    <input
                        className="h-10 px-2 w-60 border rounded"
                        type="text"
                        value={plateNumberInput}
                        onChange={e => {setPlateNumberInput(e.target.value); setPlateNumberHelperText('');}}
                    ></input>
                    <p className="text-red-700 text-sm">{plateNumberHelperText}</p>
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Date and time of entry</h1>
                    <input
                        className="h-10 px-2 w-56 border rounded"
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => handleDateInputChange(e)}
                        step="60" // Set step to 60 seconds (1 minute)
                        />
                    <p className="text-red-700 text-sm">{dateTimeHelperText}</p>
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Vehicle size</h1>
                    <select
                        value={vehicleSize}
                        onChange={(e) => setVehicleSize(e.target.value)}
                        className="border rounded h-10 px-2 w-28"
                    >
                        {['small','medium','large'].map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Entrance</h1>
                    <select
                        value={entranceInput}
                        onChange={e => setEntranceInput(e.target.value)}
                        className="border rounded h-10 px-2 w-20"
                    >
                        {entranceSelection.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col items-start w-full px-4 mt-4">
                    <h1 className="font-semibold text-neutral-950">Prioritize Cost</h1>
                    <input 
                        value={prioritizeCostInput}
                        onChange={e => setPriorityCostInput(e.target.checked)}
                        type="checkbox"
                        className="ml-1"
                    />
                </div>
                <div className="flex flex-col w-full px-4 mt-4">
                    <button className="bg-tree text-white font-semibold p-1 rounded-md w-60 h-12 my-2" onClick={handleCalculateShortestPaths}>{graph.shortestPath.length > 0 ?'Recalculate Parking':`Calculate Nearest Parking`}</button>
                    {!parkButtonDisabled && <button className="bg-pink text-white font-semibold p-1 rounded-md w-60 h-12 my-2" onClick={handleParkVehicle} disabled={parkButtonDisabled}>Park</button>}
                </div>
            </div>
        </div>
    )
}

export default ParkView;