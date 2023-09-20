import { useDispatch, useSelector } from "react-redux";
import { resetNodes, deepCompare, dijkstra, turnNodesToParking, findShortestPath, blockNodes, turnNodestoEntrance, countNumberOfEntrances } from "../utils/graphUtils";
import { setAdjacencyList, setNodeOccupancy, setShortestPath } from "../redux/graphSlice";
import { removeAllSelectedNodes, setCurrentView } from "../redux/viewSlice";
import { useEffect, useState } from "react";

const SideNav = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)
    const [entranceDisabled, setEntranceDisabled] = useState(false)
    const [parkingDisabled, setParkingDisabled] = useState(false)

    const handleBlockClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'blocked',
        }))
        const updatedAdjacencyList = blockNodes(graph.adjacencyList, viewState.selectedNodes)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }
    const handleResetClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'reset',
        }))
        const updatedAdjacencyList = resetNodes(graph.adjacencyList, viewState.selectedNodes, graph.nodeOccupancy).updatedAdjacencyList
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }

    const handleFindShortestPath = () => {
        const data = dijkstra(graph.adjacencyList, "0-0")
        const shortestPath = findShortestPath(data.distances, data.previous, "0-0","14-14")
        dispatch(setShortestPath(shortestPath))
        dispatch(setCurrentView('shortestPath'))
    }

    const handleParkingClick = (parking) => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'parking',
            parking: parking
        }))
        const updatedAdjacencyList = turnNodesToParking(graph.adjacencyList, viewState.selectedNodes, graph.nodeOccupancy)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }

    const handleEntranceClick = () => {
        dispatch(setNodeOccupancy({
            nodes: viewState.selectedNodes,
            action: 'entrance',
        }))
        const updatedAdjacencyList = turnNodestoEntrance(graph.adjacencyList, viewState.selectedNodes, graph.nodeOccupancy)
        dispatch(setAdjacencyList(updatedAdjacencyList))
        dispatch(removeAllSelectedNodes())
    }


    useEffect(() => { 
        // Disable entrance button if there is at least one non-edge node selected
        const hasNoneEdgeNode = (nodes = [], n) => {
            for (let item of nodes) {
                let [x, y] = item.split('-').map(Number);
                if (x !== 0 && x !== 14 && y !== 0 && y !== 14) {
                    return true;
                }
            }
            return false;
        }
        setEntranceDisabled(hasNoneEdgeNode(viewState.selectedNodes, graph.grapSize - 1))
    }, [viewState.selectedNodes])

    useEffect(() => {
        const numberOfEntrances = countNumberOfEntrances([], graph.nodeOccupancy)
        const numberOfEntrancesSelected = countNumberOfEntrances(viewState.selectedNodes, graph.nodeOccupancy)
        if (numberOfEntrances - numberOfEntrancesSelected < 3 && viewState.selectedNodes.length > 0 ) {
            setParkingDisabled(true)
        }  else {
            setParkingDisabled(false)
        }
    },[viewState.selectedNodes, graph.nodeOccupancy])

    return (
        <div className="h-[calc(100vh-36px)] w-1/3 bg-blue-200">
            <button className={`${parkingDisabled ? 'bg-gray-400': 'bg-slate-600'} text-white p-1 rounded-sm`} onClick={handleBlockClick} disabled={parkingDisabled}>Block</button>
            <button className="bg-slate-100 text-black p-1 rounded-sm" onClick={handleResetClick} >Reset</button>
            <button className="bg-red-200 text-black p-1 rounded-sm" onClick={() => handleParkingClick('small')}>Small Parking</button>
            <button className="bg-green-500 text-black p-1 rounded-sm" onClick={() => handleParkingClick('medium')}>Medium Parking</button>
            <button className="bg-blue-700 text-white p-1 rounded-sm" onClick={() => handleParkingClick('large')}>Large Parking</button>
            <button className={`${entranceDisabled ? 'bg-gray-400': 'bg-orange-500'} text-white p-1 rounded-sm`} onClick={() => handleEntranceClick()} disabled={entranceDisabled}>Entrance</button>
            <button className="bg-slate-400 text-black p-1 rounded-sm" onClick={handleFindShortestPath}>Find Shortest Path</button>
        </div>
    )
}

export default SideNav;