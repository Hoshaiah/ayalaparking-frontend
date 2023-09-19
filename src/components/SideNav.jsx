import { useDispatch, useSelector } from "react-redux";
import { addNodes, deepCompare, removeNodes } from "../utils/graphUtils";
import { setAdjacencyList, setNodeOccupancy } from "../redux/graphSlice";
import { removeAllSelectedNodes } from "../redux/viewSlice";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)

    const handleBlockClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'remove',
        }))
        const updatedAdjacencyList = removeNodes(graph.adjacencyList, viewState.selectedNodes)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }
    const handleResetClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'reset',
        }))
        const updatedAdjacencyList = addNodes(graph.adjacencyList, viewState.selectedNodes)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }

    return (
        <div className="h-[calc(100vh-36px)] w-1/3 bg-blue-200">
            <button className="bg-slate-600 text-white p-1 rounded-sm" onClick={handleBlockClick}>Block</button>
            <button className="bg-slate-100 text-black p-1 rounded-sm" onClick={handleResetClick}>Reset</button>
        </div>
    )
}

export default SideNav;