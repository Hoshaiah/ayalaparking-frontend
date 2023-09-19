import { useDispatch, useSelector } from "react-redux";
import { addNodes, deepCompare, dijkstra, findShortestPath, removeNodes } from "../utils/graphUtils";
import { setAdjacencyList, setNodeOccupancy, setShortestPath } from "../redux/graphSlice";
import { removeAllSelectedNodes, setCurrentView } from "../redux/viewSlice";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)

    const handleBlockClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'block',
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

    const handleFindShortestPath = () => {
        const data = dijkstra(graph.adjacencyList, "0-0")
        const shortestPath = findShortestPath(data.distances, data.previous, "0-0","14-14")
        dispatch(setShortestPath(shortestPath))
        dispatch(setCurrentView('shortestPath'))
    }

    return (
        <div className="h-[calc(100vh-36px)] w-1/3 bg-blue-200">
            <button className="bg-slate-600 text-white p-1 rounded-sm" onClick={handleBlockClick}>Block</button>
            <button className="bg-slate-100 text-black p-1 rounded-sm" onClick={handleResetClick}>Reset</button>
            <button className="bg-slate-400 text-black p-1 rounded-sm" onClick={handleFindShortestPath}>Find Shortest Path</button>
        </div>
    )
}

export default SideNav;