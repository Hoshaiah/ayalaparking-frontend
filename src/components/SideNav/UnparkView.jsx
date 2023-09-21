import { useDispatch, useSelector } from "react-redux";
import { calculateHourDifference, calculateParkingCost, dijkstra, findShortestPath, getDateTimeNow, getParkedCarNodes, turnNodesToParking, validateDateFormat } from "../../utils/graphUtils";
import {  setAdjacencyList, setNodeOccupancy, setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";
import { useState, useEffect } from "react";
import { setCarHistory } from "../../redux/historySlice";

const UnparkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)
    const [parkedCarsSelection, setParkedCarsSelection] = useState([])
    const [parkedCarInput, setParkedCarInput] = useState()
    const [dateTimeHelperText, setDateTimeHelperText] = useState('')
    const [dateInput, setDateInput]= useState(getDateTimeNow())
    const [receipt, setReceipt] = useState()
    const [disabledUnparkButton, setDisabledUnparkButton] = useState(parkedCarsSelection.length > 0)

    const handleUnparkCar = () => {
        const isDateValid = validateDateFormat(dateInput)
        if(!isDateValid) {
            setDateTimeHelperText('Date format is invalid')
            return;
        }
        
        const numberOfHoursParked = calculateHourDifference(graph.nodeOccupancy[parkedCarInput].entryTime, dateInput)
        const totalParkingCost = calculateParkingCost(numberOfHoursParked, graph.nodeOccupancy[parkedCarInput].parking)
        setReceipt(totalParkingCost)

        dispatch(setCarHistory({
            action: 'unpark',
            carPlate: graph.nodeOccupancy[parkedCarInput].carPlate,
            node: parkedCarInput,
            parkedCar: graph.nodeOccupancy[parkedCarInput].parkedCar,
            parkingSize: graph.nodeOccupancy[parkedCarInput].parking,
            entryTime: graph.nodeOccupancy[parkedCarInput].entryTime,
            exitTime: dateInput,
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
           } else {
            setDisabledUnparkButton(false)
           }
        }
        disableUnparkButton()
    },[parkedCarsSelection])

    return (
        <div>
            <div className="flex">
                <h1>Parked Vehicles:</h1>
                <select
                    value={parkedCarInput}
                    onChange={e => setParkedCarInput(e.target.value)}
                    className="border p-2 rounded"
                >
                    {parkedCarsSelection.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex">
                <h1>Date and time of exit:</h1>
                <p>{dateTimeHelperText}</p>
                <input
                    type="datetime-local"
                    value={dateInput}
                    onChange={(e) => handleDateInputChange(e)}
                    step="60" // Set step to 60 seconds (1 minute)
                />
            </div>
            <div className="flex">
                <h1>Bill Breakdown</h1>
                <div>
                </div>
            </div>
            <button className={`${disabledUnparkButton ? 'bg-slate-200':'bg-slate-400'} text-black p-1 rounded-sm`} onClick={handleUnparkCar} disabled={disabledUnparkButton}>Unpark</button>
            {receipt && 
                <div className="flex flex-col">
                    <h1>{`Number of hours parked: ~ ${Math.ceil(receipt.totalHours)}hrs (${receipt.totalHours}hrs)`}</h1>
                    {receipt.flatHourTotal && <h1>{`First 3 hours: ${receipt.flatHourTotal}`}</h1>}
                    {receipt.fullDayCosts && <h1>{`Number of full days(${receipt.numberOfFullDays}) x 5000: ${receipt.fullDayCosts} `}</h1>}
                    {receipt.continuousTotal && <h1>{`${receipt.continuousHours}hr x ${receipt.parkingSize} parking: ${receipt.continuousTotal} `}</h1>}
                    <h1>{`Total: Php ${receipt.total}`}</h1>
                </div>
            }
        </div>
    )
}

export default UnparkView;