
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSelectedNodes, removeAllSelectedNodes, removeToSelectedNodes, setCurrentView } from '../redux/viewSlice';
import { deepCompare } from '../utils/graphUtils';

const Graph = () => {
    const dispatch = useDispatch()
    const graphState= useSelector(state => state.graph)
    const viewState = useSelector(state => state.view)
    const [rows, setRows] = useState()
    

    const handleNodeClick = (node, nodeIsSelected) => {
        console.log(viewState.currentView)
        if(viewState.currentView !== 'selectView'){
            dispatch(setCurrentView('selectView'))
        }
        if(!nodeIsSelected) {
            dispatch(addToSelectedNodes(node))
        } else {
            dispatch(removeToSelectedNodes(node))
        }
    }


    useEffect(() => {
        const shortestPath = new Set(graphState.shortestPath)
        const selectedNodes = new Set(viewState.selectedNodes)
        const nodeOccupancy = graphState.nodeOccupancy
        const adjacencyList = graphState.adjacencyList
        const gridSize = Math.sqrt(Object.keys(adjacencyList).length);
        const rowToSet = Array.from({ length: gridSize }, (_, rowIndex) => {
            const nodesInRow = Object.keys(adjacencyList).filter(node => {
                const [row] = node.split('-');
                return parseInt(row, 10) === rowIndex;
            });
    
            return (
                <div key={rowIndex} className="flex flex-col-reverse">
                    {nodesInRow.map(node => {
                        const [row, col] = node.split('-');
                        const nodeInShortestPath = shortestPath.has(node)
                        const nodeIsSelected = selectedNodes.has(node)
                        const nodeIsOccupied = nodeOccupancy[node] === 'occupied'
                        return (
                            <button onClick={() => {handleNodeClick(node, nodeIsSelected)}} key={node} className={`border-black border w-8 h-8 flex items-center justify-center 
                            ${nodeInShortestPath && viewState.currentView === 'shortestPath' ? 'bg-yellow-300' : ''}
                            ${nodeIsOccupied ? 'bg-black': ''}
                            ${viewState.currentView === "selectView" && nodeIsSelected ? 'border-2 border-yellow-400': ''}
                            `} >
                                {node}
                            </button>
                        );
                    })}
                </div>
            );
        });
        setRows(rowToSet)
        // console.log(deepCompare(graphState.adjacencyList, graphState.originalAdjacencyList))
        // console.log(graphState.originalAdjacencyList)
        // console.log(graphState.adjacencyList)
    }, [graphState.shortestPath, viewState.selectedNodes, graphState.nodeOccupancy, graphState.adjacencyList, viewState.currentView])


    return (
        <div className="flex flex-row border-black border w-fit h-fit text-xs">
            {rows}
        </div>
    );
};

export default Graph;
