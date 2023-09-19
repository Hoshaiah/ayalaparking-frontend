
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const Graph = (props) => {
    const {adjacencyList} = props
    const graphState= useSelector(state => state.graph)
    const [rows, setRows] = useState()
    
    useEffect(() => {
        const shortestPath = new Set(graphState.shortestPath)
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
                        return (
                            <button key={node} className={`border-black border w-8 h-8 flex items-center justify-center ${nodeInShortestPath ? 'bg-yellow-300' : ''}`} >
                                {node}
                            </button>
                        );
                    })}
                </div>
            );
        });
        setRows(rowToSet)
    }, [graphState.shortestPath])


    return (
        <div className="flex flex-row border-black border w-fit h-fit text-xs">
            {rows}
        </div>
    );
};

export default Graph;
