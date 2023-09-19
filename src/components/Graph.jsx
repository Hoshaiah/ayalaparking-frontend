
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSelectedNodes, removeToSelectedNodes } from '../redux/viewSlice';

const Graph = (props) => {
    const {adjacencyList} = props
    const dispatch = useDispatch()
    const graphState= useSelector(state => state.graph)
    const viewState = useSelector(state => state.view)
    const [rows, setRows] = useState()
    

    const handleNodeClick = (node, nodeIsSelected) => {
        if(!nodeIsSelected) {
            dispatch(addToSelectedNodes(node))
        } else {
            dispatch(removeToSelectedNodes(node))
        }
    }


    useEffect(() => {
        const shortestPath = new Set(graphState.shortestPath)
        const selectedNodes = new Set(viewState.selectedNodes)
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
                        return (
                            <button onClick={() => {handleNodeClick(node, nodeIsSelected)}} key={node} className={`border-black border w-8 h-8 flex items-center justify-center 
                            ${nodeInShortestPath && viewState.currentView === 'shortestPath' ? 'bg-yellow-300' : ''}
                            ${viewState.currentView === "selectView" && nodeIsSelected ? 'bg-blue-400': ''}
                            `} >
                                {node}
                            </button>
                        );
                    })}
                </div>
            );
        });
        setRows(rowToSet)
    }, [graphState.shortestPath, viewState.selectedNodes])


    return (
        <div className="flex flex-row border-black border w-fit h-fit text-xs">
            {rows}
        </div>
    );
};

export default Graph;
