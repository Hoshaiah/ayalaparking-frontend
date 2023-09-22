import { useDispatch, useSelector } from "react-redux";
import { resetNodes, deepCompare, dijkstra, turnNodesToParking, findShortestPath, blockNodes, turnNodestoEntrance, countNumberOfEntrances } from "../../utils/graphUtils";
import { setAdjacencyList, setNodeOccupancy, setShortestPath } from "../../redux/graphSlice";
import { removeAllSelectedNodes, removeToSelectedNodes, setCurrentView } from "../../redux/viewSlice";
import { useEffect, useState } from "react";

const EditView = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(state => state.view)
    const graph = useSelector(state => state.graph)
    const [entranceDisabled, setEntranceDisabled] = useState(false)
    const [editDisabled, setEditDisabled] = useState(false)


    const handleClearAll = () => {
        dispatch(removeAllSelectedNodes())
    }

    const handleRemoveSelectedNode = (node) => {
        dispatch(removeToSelectedNodes(node))
    }

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
            setEditDisabled(true)
        }  else {
            setEditDisabled(false)
        }
    },[viewState.selectedNodes, graph.nodeOccupancy])

    return (
        <div className="h-full mx-1">
            <div className="flex justify-between w-full">
                <div className="flex mt-1 ml-2 text-neutral-100 font-semibold"> {'Selected nodes'}</div>
                {viewState.selectedNodes.length > 0 && <button className="text-neutral-100 text-xs my-1 select-none border-gray-50 border rounded-md px-1 " onClick={()=> handleClearAll()}>Clear all selected</button>}
            </div>
            <div className="align-start flex flex-wrap space-x-1 h-28 bg-neutral-200 overflow-scroll overflow-x-hidden">
                {viewState.selectedNodes && viewState.selectedNodes.map((node) => (
                    <div className="flex bg-neutral-50 w-16 h-8 rounded-lg items-center justify-around m-1 border-neutral-900 border">
                        <button className="select-none font-semibold text-neutral-700 hover:text-gray-500" onClick={() => handleRemoveSelectedNode(node)}>x</button>
                       <h1 className="select-none">{node}</h1> 
                    </div>
                ))}
            </div>
            <div className="flex flex-col w-full ml-2 mt-2 text-neutral-100 font-semibold text-md"> {'Edit nodes'}</div>
            <div className="flex flex-col w-full h-full items-center bg-neutral-200 overflow-y-scroll overflow-x-hidden"> 
                <button className={`${editDisabled? 'bg-gray-400 text-white': 'bg-neutral-100 hover:opacity-90'} text-black font-semibold p-1 rounded-md w-40 h-12 mt-4 mb-2`} onClick={handleResetClick} disabled={editDisabled} >Reset</button>
                <button className={`${editDisabled? 'bg-gray-400': 'bg-saffron hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 my-2`} onClick={() => handleParkingClick('small')} disabled={editDisabled} >Small Parking</button>
                <button className={`${editDisabled? 'bg-gray-400':'bg-sandy hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 my-2`} onClick={() => handleParkingClick('medium')} disabled={editDisabled} >Medium Parking</button>
                <button className={`${editDisabled? 'bg-gray-400': 'bg-pink hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 my-2`} onClick={() => handleParkingClick('large')} disabled={editDisabled} >Large Parking</button>
                <button className={`${editDisabled ? 'bg-gray-400': 'bg-tree hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 my-2`} onClick={handleBlockClick} disabled={editDisabled}>Block</button>
                <button className={`${entranceDisabled ? 'bg-gray-400': 'bg-teal hover:opacity-90'} text-white font-semibold p-1 rounded-md w-40 h-12 mb-4 mt-2`} onClick={() => handleEntranceClick()} disabled={entranceDisabled}>Entrance</button>
                <div className="px-3 pt-1 text-sm text-gray-800">
                    <h1>Notes:</h1>
                    <ul className="list-disc pl-5 text-xs">
                        <li>There must be at least three entrance blocks present to perform other operations.</li>
                        <li>Entrances may only be put on edges</li>
                        <li>Nodes with cars parked may not be edited</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EditView;