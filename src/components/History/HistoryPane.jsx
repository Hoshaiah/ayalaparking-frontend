import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const HistoryPane = () => {
    const history = useSelector(state => state.history)
    const [carSelection, setCarSelection] = useState([''])
    const [carSelected, setCarSelected] = useState()
    const [sortDescending, setSortDescending] = useState(true)

    const handleClickSort = () => {
        if(sortDescending) {
            setSortDescending(false)
            return;
        }
        setSortDescending(true)
    }

    useEffect(() => {
        const getCarsParked = () => {
            let carsParked = ['',...Object.keys(history.carHistory)]
            setCarSelection(carsParked)
        }
        getCarsParked()
    }, [history.carHistory])
    
    return(
        <div className=" w-[32rem] bg-neutral-500 p-0">
            <div className="flex flex-col w-full">
                <div className="flex items-center bg-neutral-200 font-bold w-full h-10">
                    <h1 className="bg-neutral-500 h-full p-2 text-neutral-100">Vehicle history</h1>
                </div>
                <div className="flex items-end pt-2 ">
                    <select
                        value={carSelected}
                        onChange={e => setCarSelected(e.target.value)}
                        className="border rounded h-10 px-2 mx-4 w-20"
                    >
                        {carSelection.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleClickSort} className="flex items-center justify-center border-white border text-white h-8 px-1 w-32 rounded-md text-xs">
                        {sortDescending ? ' Most recent ↓' : 'From first ↑'}
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full h-[calc(100vh-10rem)] mt-4">
                {carSelected !== '' && history.carHistory[carSelected] &&
                    <div className={`flex ${sortDescending ? 'flex-col' : 'flex-col-reverse'} flex-1 overflow-y-scroll px-2 pb-4`}>
                       {history.carHistory[carSelected].slice().reverse().map((item) => (
                        <div className="flex flex-col pl-6 mt-4 text-sm w-full bg-gray-200">
                            {item.action && <div className="flex w-full">
                                <h1 className="w-fit">{`Action:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.action}`}</h1>
                            </div>}
                            {item.node && <div className="flex w-full">
                                <h1 className="w-fit">{`Node:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.node}`}</h1>
                            </div>}
                            {item.parkedCar && <div className="flex w-full">
                                <h1 className="w-fit">{`Parked car size:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.parkedCar}`}</h1>
                            </div>}
                            {item.parkingSize && <div className="flex w-full">
                                <h1 className="w-fit">{`Parking size:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.parkingSize}`}</h1>
                            </div>}
                            {item.entryTime && <div className="flex w-full">
                                <h1 className="w-fit">{`Entry time:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.entryTime}`}</h1>
                            </div>}
                            {item.recentEntryTime && item.recentEntryTime !== 'f' && <div className="flex w-full">
                                <h1 className="w-fit">{`New Entry time:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.recentEntryTime}`}</h1>
                            </div>}
                            {item.exitTime && <div className="flex w-full">
                                <h1 className="w-fit">{`Exit time:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.exitTime}`}</h1>
                            </div>}
                            <div className="flex w-full">
                                <h1 className="w-fit">{`Cost paid from previous:`}</h1>
                                <h1 className="w-fit pl-2">{`${item.costPaidAlready}`}</h1>
                            </div>
                            {item.totalBill !== undefined && item.totalBill !== null && <div className="flex w-full">
                                <h1 className="w-fit">{`Total bill:`}</h1>
                                <h1 className="w-fit pl-2">{`Php ${item.totalBill}`}</h1>
                            </div>}
                        </div>
                       ))} 
                    </div>
                }
            </div>
        </div>
    )
}

export default HistoryPane;