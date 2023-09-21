import { useDispatch, useSelector } from "react-redux";
import { dijkstra, findNearestParking, findShortestPath, getDateTimeNow, getEntranceNodes } from "../../utils/graphUtils";
import {  setDistances, setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";
import { useEffect, useRef, useState } from "react";

const ParkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)
    const plateNumberInput = useRef('')
    const entranceInput = useRef()
    const prioritizeCostInput = useRef(false)
    const vehicleSize = useRef('small')
    const [dateInput, setDateInput]= useState(getDateTimeNow())
    const [entranceSelection, setEntranceSelection] = useState([])

    const handleDateInputChange = (e) => {
        const inputValue = e.target.value;
        const formattedDate = inputValue.replace('T', ' ');
        setDateInput(formattedDate);
    }

    const handleCalculateShortestPaths = () => {
        const data = dijkstra(graph.adjacencyList, entranceInput.current.value )
        dispatch(setDistances(data.distances))
        dispatch(setDistances(data.previous))
        const nearestParking = findNearestParking(data.distances,graph.nodeOccupancy, vehicleSize.current.value, prioritizeCostInput.current.checked)[0]

        const shortestPath = findShortestPath(data.distances, data.previous, entranceInput.current.value, nearestParking.node)
        dispatch(setShortestPath(shortestPath)) 
    }

    const handleParkVehicle = () => {

    }

    useEffect(() => {
        const getEntranceNodesList = () => {
            const entranceNodes = getEntranceNodes(graph.nodeOccupancy)
            setEntranceSelection(entranceNodes)
        }
        getEntranceNodesList()
    }, [graph.nodeOccupancy])
    
    return (
        <div>
            <div className="flex">
                <h1>Plate Number</h1>
                <input
                    type="text"
                    ref={plateNumberInput}
                ></input>
            </div>
            <div className="flex">
                <h1>Vehicle size:</h1>
                <select
                    ref={vehicleSize}
                    // onChange={setVehicleSize}
                    className="border p-2 rounded"
                >
                    {['small','medium','large'].map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex">
                <h1>Date and time of entry:</h1>
                <input
                    type="datetime-local"
                    value={dateInput}
                    onChange={(e) => handleDateInputChange(e)}
                    step="60" // Set step to 60 seconds (1 minute)
                />
            </div>
            <div className="flex">
                <h1>Entrance:</h1>
                <select
                    ref={entranceInput}
                    className="border p-2 rounded"
                >
                    {entranceSelection.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex">
                <h1>Prioritize Cost</h1>
                <input ref={prioritizeCostInput} type="checkbox" />
            </div>
            <div className="flex">
                <button className="bg-slate-400 text-black p-1 rounded-sm" onClick={handleCalculateShortestPaths}>Calculate Nearest Parking</button>
                <button className="bg-slate-800 text-white p-1 rounded-sm" onClick={handleParkVehicle}>Park</button>
            </div>
        </div>
    )
}

export default ParkView;