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
    const [disableCalculateButton, setDisableCalculateButton] = useState(parkedCarsSelection.length > 0)
    const [parkedCarHelperText, setParkedCarHelperText] = useState('')

    const handleCalculateParkingCost = () => {
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

        const lastUnParkHistory = currentVehicleHistory && currentVehicleHistory[currentVehicleHistory.length-2]
        const differenceBetweenCurrentAndPreviousExit = lastUnParkHistory && calculateHourDifference(lastUnParkHistory.exitTime, dateInput)
        if(differenceBetweenCurrentAndPreviousExit < 0) {
            setDateTimeHelperText(`Your last exit time ${lastUnParkHistory.exitTime} is later than your current exit time ${dateInput}. This is not possible my friend.`)
            return;
        }
    
        const totalParkingBreakdown = calculateParkingCost(numberOfHoursParked, lastParkHistory.parkingSize)
        totalParkingBreakdown['costPaidAlready'] = lastParkHistory.costPaidAlready || 0
        totalParkingBreakdown['carPlate'] = carPlate
        totalParkingBreakdown['entryTime'] = lastParkHistory.entryTime
        totalParkingBreakdown['exitTime'] = dateInput
        totalParkingBreakdown['parkingSize'] = lastParkHistory.parkingSize
        setReceipt(totalParkingBreakdown)
    }

    const handleUnparkCar = () => {
        dispatch(setCarHistory({
            action: 'unpark',
            carPlate: receipt.carPlate,
            node: parkedCarInput,
            parkedCar: graph.nodeOccupancy[parkedCarInput].parkedCar,
            entryTime: receipt.entryTime,
            exitTime: dateInput,
            parkingSize: receipt.parkingSize,
            costPaidAlready: receipt.costPaidAlready,
            totalBill: receipt.total,
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
            setDisableCalculateButton(true)
            setParkedCarHelperText('No cars are parked')
           } else {
            setDisableCalculateButton(false)
            setParkedCarHelperText('')
           }
        }
        disableUnparkButton()
    },[parkedCarsSelection])

    useEffect(() => {
        const refreshReceipt = () => {
            setReceipt(null)
        }
        refreshReceipt()
    }, [parkedCarInput, dateInput])

    useEffect(() => {
        const refreshDateHelperTextOnNodeChange = () => {
            setDateTimeHelperText('')
        }
        refreshDateHelperTextOnNodeChange()
    }, [parkedCarInput, dateInput])

    return (
        <div className="h-full mx-1 overflow-y-scroll scrollbar-disappear">
            <div className="flex flex-col w-full ml-2 mt-1 text-neutral-100 font-semibold text-md"> {'Unpark car details'}</div>
            <div className={`flex flex-col w-full ${receipt ? 'h-64':'h-full'} items-center bg-neutral-200`}>
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
                    <input
                        className="h-10 px-2 w-56 border rounded"
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => handleDateInputChange(e)}
                        step="60" // Set step to 60 seconds (1 minute)
                    />
                    <p className="text-red-700 text-sm" >{dateTimeHelperText}</p>
                </div>
                <div className="flex flex-col w-full px-4 mt-6">
                    <button className={`${disableCalculateButton ? 'bg-gray-400':'bg-tree hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 mb-4 mt-6"`} onClick={handleCalculateParkingCost} disabled={disableCalculateButton}>Calculate Costs</button>
                </div>

            </div>
            {receipt && 
                <div className="flex flex-col h-full">
                    <div className="flex flex-col w-full ml-2 mt-1 text-neutral-100 font-semibold text-md"> {'Bill Breakdown'}</div>
                    <div className="flex flex-col w-full h-full p-5 bg-neutral-200">
                        <div className="flex">
                            <h1 className="font-semibold text-neutral-950">Vehicle Plate:</h1>
                            <h1 className="ml-2"> {`${receipt.carPlate}`}</h1>
                        </div>
                        <div className="flex">
                            <h1 className="font-semibold text-neutral-950">Entry:</h1>
                            <h1 className="ml-2"> {`${receipt.entryTime}`}</h1>
                        </div>
                        <div className="flex">
                            <h1 className="font-semibold text-neutral-950">Exit:</h1>
                            <h1 className="ml-2"> {`${receipt.exitTime}`}</h1>
                        </div>
                        <div className="flex">
                            <h1 className="font-semibold text-neutral-950">Number of hours parked:</h1>
                            <h1 className="ml-2"> {`~${Math.ceil(receipt.totalHours)}hrs (${receipt.totalHours}hrs)`}</h1>
                        </div>
                        <div className="flex w-full flex-col">
                            <h1 className="font-semibold w-full text-neutral-950">Cost Breakdown:</h1>
                            <div className="flex flex-col pr-16 pl-6 mt-4 text-sm w-full">
                                {receipt.flatHourTotal && <div className="flex justify-between w-full">
                                    <h1 className="w-32">{`First 3 hours`}</h1>
                                    <h1 className="w-fit">{`${receipt.flatHourTotal}`}</h1>
                                </div>}
                                {receipt.fullDayCosts && <div className="flex justify-between w-full">
                                    <h1 className="w-32">{`Number of full days(${receipt.numberOfFullDays}) x 5000`}</h1>
                                    <h1>{`${receipt.fullDayCosts}`}</h1>
                                </div>}
                                {receipt.continuousTotal > 0 && <div className="flex justify-between w-full">
                                    <h1 className="w-32">{`${receipt.continuousHours}hr x ${receipt.parkingSize} parking`}</h1>
                                    <h1 className="w-fit">{`${receipt.continuousTotal}`}</h1>
                                </div>}
                                <div className="border-b border-gray-900"></div>
                                <div className="flex justify-between w-full">
                                    <h1 className="w-32">{`Total`}</h1>
                                    <h1 className="w-fit">{`Php ${receipt.total}`}</h1>
                                </div>
                                {receipt.costPaidAlready > 0 && 
                                    <div className="">
                                        <div className="flex justify-between">
                                            <h1 className="w-32">{`Cost paid already`}</h1>
                                            <h1 className="w-fit">{`- ${receipt.costPaidAlready}`}</h1>
                                        </div>
                                        <div className="border-b border-gray-900"></div>
                                        <div className="flex justify-between">
                                            <h1 className="w-32">{`Total Cost - Cost paid`}</h1>
                                            <h1 className="w-fit">{`Php ${receipt.total - receipt.costPaidAlready}`}</h1>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-end pr-14">
                            <button className={`bg-pink hover:opacity-90 text-white font-semibold p-1 rounded-md w-40 h-12 mb-4 mt-6`} onClick={handleUnparkCar}>Unpark Car</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UnparkView;