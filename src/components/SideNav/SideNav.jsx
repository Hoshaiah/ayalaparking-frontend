import { useDispatch, useSelector } from "react-redux";
import EditView from "./EditView";
import ParkView from "./ParkView";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)


    return (
        <div className="h-[calc(100vh-36px)] w-1/3 bg-blue-200">
            <EditView/>
            <ParkView/>
        </div>
    )
}

export default SideNav;