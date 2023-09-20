import { useDispatch, useSelector } from "react-redux";
import EditView from "./EditView";
import ParkView from "./ParkView";
import { setCurrentView } from "../../redux/viewSlice";
import UnparkView from "./UnparkView";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)


    const handleEditClick = () => {
        dispatch(setCurrentView('editView'))
    }

    const handleParkClick = () => {
        dispatch(setCurrentView('parkView'))
    }
    
    const handleUnparkClick = () => {
        dispatch(setCurrentView('unparkView'))
    }

    return (
        <div className="h-[calc(100vh-36px)] w-1/3 bg-slate-300">
            <div className="flex bg-white">
                <button 
                    className={`w-1/3 p-2 flex items-center justify-center rounded-t-xl border-r border-t
                        ${viewState.currentView === 'editView' ? 'bg-blue-900 text-white': 'bg-white'}`}
                    onClick={handleEditClick}
                >Edit</button>

                <button
                    className={`w-1/3 p-2 flex items-center justify-center rounded-t-xl border-r border-t
                        ${viewState.currentView === 'parkView' ? 'bg-blue-900 text-white': 'bg-white'}`}
                    onClick={handleParkClick}
                >Park</button>

                <button 
                    className={`w-1/3 p-2 flex items-center justify-center rounded-t-xl border-r border-t
                        ${viewState.currentView === 'unparkView' ? 'bg-blue-900 text-white': 'bg-white'}`}
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