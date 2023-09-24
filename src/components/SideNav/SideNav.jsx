import { useDispatch, useSelector } from "react-redux";
import EditView from "./EditView";
import ParkView from "./ParkView";
import { removeAllSelectedNodes, setCurrentView } from "../../redux/viewSlice";
import UnparkView from "./UnparkView";
import { setShortestPath } from "../../redux/graphSlice";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)


    const handleEditClick = () => {
        dispatch(setCurrentView('editView'))
        dispatch(setShortestPath([]))
    }

    const handleParkClick = () => {
        dispatch(setCurrentView('parkView'))
        dispatch(removeAllSelectedNodes())
    }
    
    const handleUnparkClick = () => {
        dispatch(setCurrentView('unparkView'))
        dispatch(setShortestPath([]))
        dispatch(removeAllSelectedNodes())
    }

    return (
        <div className="h-[calc(100vh-36px)] w-[32rem] bg-neutral-500">
            <div className="flex bg-neutral-500">
                <button 
                    className={`w-1/3 p-2 flex items-center justify-center font-bold border-r border-neutral-500
                        ${viewState.currentView === 'editView' ? 'bg-neutral-500 text-white': 'bg-neutral-200 text-black'}`}
                    onClick={handleEditClick}
                >Edit</button>

                <button
                    className={`w-1/3 p-2 flex items-center justify-center font-bold border-r border-neutral-500
                        ${viewState.currentView === 'parkView' ?  'bg-neutral-500 text-white': 'bg-neutral-200 text-black'}`}
                    onClick={handleParkClick}
                >Park</button>

                <button 
                    className={`w-1/3 p-2 flex items-center justify-center font-bold
                        ${viewState.currentView === 'unparkView' ? 'bg-neutral-500 text-white': 'bg-neutral-200 text-black'}`}
                    onClick={handleUnparkClick}
                >UnPark</button>
            </div>
            {viewState.currentView ==='editView' && <EditView/>}
            {viewState.currentView ==='parkView' && <ParkView/>}
            {viewState.currentView ==='unparkView' && <UnparkView/>}
        </div>
    )
}

export default SideNav;