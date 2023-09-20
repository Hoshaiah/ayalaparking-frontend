import { useDispatch, useSelector } from "react-redux";
import { dijkstra, findShortestPath, getDateTimeNow, getEntranceNodes } from "../../utils/graphUtils";
import {  setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";
import { useEffect, useState } from "react";

const ParkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)
    const [plateNumber, setPlateNumber] = useState('')
    const [vehicleSize, setVehicleSize] = useState('small')
    const [entranceSelected, setEntranceSelected] = useState('')
    const [dateInput, setDateInput] = useState(getDateTimeNow())
    const [entranceSelection, setEntranceSelection] = useState([])

    const handleFindShortestPath = () => {
        const data = dijkstra(graph.adjacencyList, "0-0")
        const shortestPath = findShortestPath(data.distances, data.previous, "0-0","14-14")
        dispatch(setShortestPath(shortestPath))
        dispatch(setCurrentView('parkView'))
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
                    value={plateNumber}
                    onChange={setPlateNumber}
                ></input>
            </div>
            <div className="flex">
                <h1>Vehicle size:</h1>
                <select
                    value={vehicleSize}
                    onChange={setVehicleSize}
                    className="border p-2 rounded"
                >
                    {['Small','Medium','Large'].map((item, index) => (
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
                    onChange={setDateInput}
                    step="60" // Set step to 60 seconds (1 minute)
                />
            </div>
            <div className="flex">
                <h1>Entrance:</h1>
                <select
                    value={entranceSelected}
                    onChange={setEntranceSelected}
                    className="border p-2 rounded"
                >
                    {entranceSelection.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <button className="bg-slate-400 text-black p-1 rounded-sm" onClick={handleFindShortestPath}>Find Shortest Path</button>
        </div>
    )
}

export default ParkView;