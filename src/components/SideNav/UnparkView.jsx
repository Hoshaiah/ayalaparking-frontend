import { useDispatch, useSelector } from "react-redux";
import { dijkstra, findShortestPath } from "../../utils/graphUtils";
import {  setShortestPath } from "../../redux/graphSlice";
import { setCurrentView } from "../../redux/viewSlice";

const UnparkView = () => {
    const dispatch = useDispatch()
    const graph = useSelector(state => state.graph)

    const handleFindShortestPath = () => {
        const data = dijkstra(graph.adjacencyList, "0-0")
        const shortestPath = findShortestPath(data.distances, data.previous, "0-0","14-14")
        dispatch(setShortestPath(shortestPath))
        dispatch(setCurrentView('parkView'))
    }

    return (
        <div>
            <button className="bg-slate-400 text-black p-1 rounded-sm" onClick={handleFindShortestPath}>Find Shortest Path</button>
        </div>
    )
}

export default UnparkView;